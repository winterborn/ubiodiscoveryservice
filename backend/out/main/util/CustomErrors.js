import { Exception } from "@ubio/framework";
export class NotFoundError extends Exception {
    constructor() {
        super(...arguments);
        this.name = "NotFoundError";
        this.message = "The requested resource was not found";
    }
}
export class ServerError extends Exception {
    constructor() {
        super(...arguments);
        this.name = "ServerError";
        this.message = "Internal server error occurred";
    }
}
//# sourceMappingURL=CustomErrors.js.map