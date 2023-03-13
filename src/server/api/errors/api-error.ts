import { ZodError } from "zod";
import { NON_EXISTENT_FIELD } from "~/consts";

export class ApiError extends ZodError {
  constructor(message: string, field?: string) {
    super([{ message, code: "custom", path: [field || NON_EXISTENT_FIELD] }]);
  }
}
