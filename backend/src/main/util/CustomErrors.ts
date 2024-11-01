import { Exception } from "@ubio/framework";

export class NotFoundError extends Exception {
  override name = "NotFoundError";
  override message = "The requested resource was not found";
}

export class ServerError extends Exception {
  override name = "ServerError";
  override message = "Internal server error occurred";
}
