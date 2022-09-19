export class UsersApiError extends Error {
  public readonly status: number;
  public readonly details: unknown;

  constructor(status: number, details: unknown) {
    super(`UsersApi returns status ${status}`);
    Object.setPrototypeOf(this, UsersApiError.prototype);
    this.name = UsersApiError.name;
    this.status = status;
    this.details = details;
  }
}
