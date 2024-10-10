import { Express } from "express";
export declare function fn_ageslog(_req: any, _res: any): void;
export declare function fn_ageslog_download(_req: any, _res: any): void;
export declare function dtString(date: Date): string;
export declare function datetoTZ(date: Date): Date;
export declare function fn_logshow(app: Express): void;
export declare class AgesLog {
    static debug(...args: any[]): void;
    static infox(texto: string, req: any, ...args: any[]): void;
    static errorx(texto: string, req: any, ...args: any[]): void;
    static info(...args: any[]): void;
    static logx(texto: string, req: any, ...args: any[]): void;
    static log(...args: any[]): void;
    static warn(...args: any[]): void;
    static error(...args: any[]): void;
    static sendLog(para: string, asunto: string, texto: string): Promise<String>;
    static sendMailDebug(asunto: string, texto: string, filePath1: string, filePath2: string): Promise<String>;
    static sendMail(para: string, asunto: string, texto: string, filePath1: string, filePath2: string): Promise<String>;
}
