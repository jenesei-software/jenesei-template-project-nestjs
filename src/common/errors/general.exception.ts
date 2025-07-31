import { ValidationException } from './general/validation.exception';
import { UnauthorizedException } from './general/unauthorized.exception';

export const GeneralExceptions = [ValidationException, UnauthorizedException];

export { ValidationException, UnauthorizedException };
