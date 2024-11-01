import { Exception } from "@ubio/framework";
export declare class NotFoundError extends Exception {
    name: string;
    message: string;
}
export declare class ServerError extends Exception {
    name: string;
    message: string;
}
