import crypto from "crypto";
import { getMSIdentity } from "./conf_default_config";

export type InterMsTokenPayload = {
  iss: string;
  sub: string;
  aud: string;
  scope: string[];
  mscode: string;
  instance: string;
  serviceType: string;
  url: string;
  iat: number;
  exp: number;
};

export type InterMsTokenOptions = {
  audience?: string;
  scopes?: string[];
  ttlSeconds?: number;
};

export type InterMsVerifiedToken = {
  valid: boolean;
  payload?: InterMsTokenPayload;
  error?: string;
};

function base64UrlEncode(value: string | Buffer): string {
  return Buffer.from(value).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64UrlDecode(value: string): Buffer {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
  return Buffer.from(padded, "base64");
}

function getSecret(): string {
  return process.env.INTER_MS_AUTH_SECRET || process.env.EC_INTER_MS_SECRET || process.env.MS_SHARED_SECRET || "";
}

function sign(input: string, secret: string): string {
  return base64UrlEncode(crypto.createHmac("sha256", secret).update(input).digest());
}

function timingSafeEqualText(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function createInterMsServiceToken(options: InterMsTokenOptions = {}): string {
  const secret = getSecret();
  if (!secret) throw new Error("INTER_MS_AUTH_SECRET no configurado");

  const identity = getMSIdentity();
  const now = Math.floor(Date.now() / 1000);
  const ttlSeconds = Math.max(30, Math.min(Number(options.ttlSeconds || process.env.INTER_MS_AUTH_TTL || 300), 3600));
  const payload: InterMsTokenPayload = {
    iss: "solinges-ecosystem",
    sub: `${identity.mscode}/${identity.msinstance}`,
    aud: options.audience || "solinges-ecosystem",
    scope: options.scopes && options.scopes.length > 0 ? options.scopes : ["ms:call"],
    mscode: identity.mscode,
    instance: identity.msinstance,
    serviceType: identity.serviceType,
    url: identity.url,
    iat: now,
    exp: now + ttlSeconds
  };
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const unsigned = `${encodedHeader}.${encodedPayload}`;
  return `${unsigned}.${sign(unsigned, secret)}`;
}

export function verifyInterMsServiceToken(token: string, expectedAudience?: string): InterMsVerifiedToken {
  const secret = getSecret();
  if (!secret) return { valid: false, error: "INTER_MS_AUTH_SECRET no configurado" };
  const parts = String(token || "").split(".");
  if (parts.length !== 3) return { valid: false, error: "Token invalido" };
  const [encodedHeader, encodedPayload, signature] = parts;
  const unsigned = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = sign(unsigned, secret);
  if (!timingSafeEqualText(signature, expectedSignature)) return { valid: false, error: "Firma invalida" };

  let header: any;
  let payload: InterMsTokenPayload;
  try {
    header = JSON.parse(base64UrlDecode(encodedHeader).toString("utf8"));
    payload = JSON.parse(base64UrlDecode(encodedPayload).toString("utf8"));
  } catch {
    return { valid: false, error: "Payload invalido" };
  }
  if (header.alg !== "HS256" || header.typ !== "JWT") return { valid: false, error: "Algoritmo no soportado" };
  const now = Math.floor(Date.now() / 1000);
  if (!payload.exp || payload.exp < now) return { valid: false, error: "Token expirado" };
  if (payload.iat && payload.iat > now + 60) return { valid: false, error: "Token emitido en el futuro" };
  if (expectedAudience && payload.aud !== expectedAudience && payload.aud !== "solinges-ecosystem") {
    return { valid: false, error: "Audiencia invalida" };
  }
  return { valid: true, payload };
}

export function getInterMsAuthorizationHeaders(options: InterMsTokenOptions = {}): Record<string, string> {
  const token = createInterMsServiceToken(options);
  const identity = getMSIdentity();
  return {
    Authorization: `Bearer ${token}`,
    "X-EC-MS-Code": identity.mscode,
    "X-EC-MS-Instance": identity.msinstance,
    "X-EC-MS-Service-Type": identity.serviceType
  };
}

export function extractBearerToken(req: any): string {
  const authorization = String(req?.headers?.authorization || req?.headers?.Authorization || "");
  if (authorization.toLowerCase().startsWith("bearer ")) return authorization.slice(7).trim();
  return String(req?.headers?.["x-ec-service-token"] || req?.headers?.["x-inter-ms-token"] || req?.query?.serviceToken || "");
}

export function requireInterMsAuth(scopes: string[] = [], expectedAudience?: string) {
  return (req: any, res: any, next: any) => {
    const token = extractBearerToken(req);
    const verification = verifyInterMsServiceToken(token, expectedAudience);
    if (!verification.valid || !verification.payload) {
      res.status(401).send({ error: "INTER_MS_NO_AUTORIZADO", message: verification.error || "Token inter-MS invalido" });
      return;
    }
    const payloadScopes = verification.payload.scope || [];
    const missingScopes = scopes.filter(scope => !payloadScopes.includes(scope) && !payloadScopes.includes("ms:*"));
    if (missingScopes.length > 0) {
      res.status(403).send({ error: "INTER_MS_SCOPE_INSUFICIENTE", missingScopes });
      return;
    }
    req.interMsAuth = verification.payload;
    next();
  };
}
