import { registerExceptionStatus } from './exception-status.map';

export enum ExceptionCode {
  NOT_FOUND = 'NOT_FOUND',
  FORBIDDEN = 'FORBIDDEN',
  UNAUTHORIZED = 'UNAUTHORIZED',
  CONFLICT = 'CONFLICT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

export class DomainException extends Error {
  constructor(
    public readonly message: string,
    public readonly code: string,
    public readonly errors?: string[],
    public readonly meta?: Record<string, unknown>,
  ) {
    super(message);
  }
}

export class NotFoundException extends DomainException {
  constructor(message: string, code: string = ExceptionCode.NOT_FOUND) {
    super(message, code);
  }
}

export class ForbiddenException extends DomainException {
  constructor(message: string, code = ExceptionCode.FORBIDDEN) {
    super(message, code);
  }
}

export class UnauthorizedException extends DomainException {
  constructor(message: string, code = ExceptionCode.UNAUTHORIZED) {
    super(message, code);
  }
}

export class ConflictException extends DomainException {
  constructor(message: string, code = ExceptionCode.CONFLICT) {
    super(message, code);
  }
}

export class ValidationException extends DomainException {
  constructor(message: string, code = ExceptionCode.VALIDATION_ERROR) {
    super(message, code);
  }
}

registerExceptionStatus(ExceptionCode.CONFLICT, 409);
registerExceptionStatus(ExceptionCode.FORBIDDEN, 43);
registerExceptionStatus(ExceptionCode.NOT_FOUND, 404);
registerExceptionStatus(ExceptionCode.UNAUTHORIZED, 401);
registerExceptionStatus(ExceptionCode.VALIDATION_ERROR, 400);
