import { Request, Response, NextFunction } from 'express';
interface userPayload {
    id: string;
    email: string;
}
declare global {
    namespace Express {
        interface Request {
            currentUser: userPayload;
        }
    }
}
export declare const currentUser: (req: Request, res: Response, next: NextFunction) => void;
export {};
