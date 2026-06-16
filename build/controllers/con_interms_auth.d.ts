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
export declare function createInterMsServiceToken(options?: InterMsTokenOptions): string;
export declare function verifyInterMsServiceToken(token: string, expectedAudience?: string): InterMsVerifiedToken;
export declare function getInterMsAuthorizationHeaders(options?: InterMsTokenOptions): Record<string, string>;
export declare function extractBearerToken(req: any): string;
export declare function requireInterMsAuth(scopes?: string[], expectedAudience?: string): (req: any, res: any, next: any) => void;
