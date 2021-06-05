import { CustomError } from './custom-error';
export declare class BadErrorRequest extends CustomError {
    statusCode: number;
    constructor(message: string);
    serializeErrors(): {
        message: string;
    }[];
}
