export const EXCEPTION_STATUS_MAP = new Map<string, number>([
  ['NOT_FOUND', 404],
  ['FORBIDDEN', 403],
  ['UNAUTHORIZED', 401],
  ['CONFLICT', 409],
  ['VALIDATION_ERROR', 400],
]);

export function registerExceptionStatus(code: string, status: number): void {
  EXCEPTION_STATUS_MAP.set(code, status);
}
