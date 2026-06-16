"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInterMsServiceToken = createInterMsServiceToken;
exports.verifyInterMsServiceToken = verifyInterMsServiceToken;
exports.getInterMsAuthorizationHeaders = getInterMsAuthorizationHeaders;
exports.extractBearerToken = extractBearerToken;
exports.requireInterMsAuth = requireInterMsAuth;
const crypto_1 = __importDefault(require("crypto"));
const conf_default_config_1 = require("./conf_default_config");
function base64UrlEncode(value) {
    return Buffer.from(value).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function base64UrlDecode(value) {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
    return Buffer.from(padded, "base64");
}
function getSecret() {
    return process.env.INTER_MS_AUTH_SECRET || process.env.EC_INTER_MS_SECRET || process.env.MS_SHARED_SECRET || "";
}
function sign(input, secret) {
    return base64UrlEncode(crypto_1.default.createHmac("sha256", secret).update(input).digest());
}
function timingSafeEqualText(left, right) {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);
    if (leftBuffer.length !== rightBuffer.length)
        return false;
    return crypto_1.default.timingSafeEqual(leftBuffer, rightBuffer);
}
function createInterMsServiceToken(options = {}) {
    const secret = getSecret();
    if (!secret)
        throw new Error("INTER_MS_AUTH_SECRET no configurado");
    const identity = (0, conf_default_config_1.getMSIdentity)();
    const now = Math.floor(Date.now() / 1000);
    const ttlSeconds = Math.max(30, Math.min(Number(options.ttlSeconds || process.env.INTER_MS_AUTH_TTL || 300), 3600));
    const payload = {
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
function verifyInterMsServiceToken(token, expectedAudience) {
    const secret = getSecret();
    if (!secret)
        return { valid: false, error: "INTER_MS_AUTH_SECRET no configurado" };
    const parts = String(token || "").split(".");
    if (parts.length !== 3)
        return { valid: false, error: "Token invalido" };
    const [encodedHeader, encodedPayload, signature] = parts;
    const unsigned = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = sign(unsigned, secret);
    if (!timingSafeEqualText(signature, expectedSignature))
        return { valid: false, error: "Firma invalida" };
    let header;
    let payload;
    try {
        header = JSON.parse(base64UrlDecode(encodedHeader).toString("utf8"));
        payload = JSON.parse(base64UrlDecode(encodedPayload).toString("utf8"));
    }
    catch (_a) {
        return { valid: false, error: "Payload invalido" };
    }
    if (header.alg !== "HS256" || header.typ !== "JWT")
        return { valid: false, error: "Algoritmo no soportado" };
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now)
        return { valid: false, error: "Token expirado" };
    if (payload.iat && payload.iat > now + 60)
        return { valid: false, error: "Token emitido en el futuro" };
    if (expectedAudience && payload.aud !== expectedAudience && payload.aud !== "solinges-ecosystem") {
        return { valid: false, error: "Audiencia invalida" };
    }
    return { valid: true, payload };
}
function getInterMsAuthorizationHeaders(options = {}) {
    const token = createInterMsServiceToken(options);
    const identity = (0, conf_default_config_1.getMSIdentity)();
    return {
        Authorization: `Bearer ${token}`,
        "X-EC-MS-Code": identity.mscode,
        "X-EC-MS-Instance": identity.msinstance,
        "X-EC-MS-Service-Type": identity.serviceType
    };
}
function extractBearerToken(req) {
    var _a, _b, _c, _d, _e;
    const authorization = String(((_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization) || ((_b = req === null || req === void 0 ? void 0 : req.headers) === null || _b === void 0 ? void 0 : _b.Authorization) || "");
    if (authorization.toLowerCase().startsWith("bearer "))
        return authorization.slice(7).trim();
    return String(((_c = req === null || req === void 0 ? void 0 : req.headers) === null || _c === void 0 ? void 0 : _c["x-ec-service-token"]) || ((_d = req === null || req === void 0 ? void 0 : req.headers) === null || _d === void 0 ? void 0 : _d["x-inter-ms-token"]) || ((_e = req === null || req === void 0 ? void 0 : req.query) === null || _e === void 0 ? void 0 : _e.serviceToken) || "");
}
function requireInterMsAuth(scopes = [], expectedAudience) {
    return (req, res, next) => {
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
