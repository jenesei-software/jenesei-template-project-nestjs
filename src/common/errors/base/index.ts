import { BadRequestException } from './bad-request.exception';
import { ForbiddenException } from './forbidden.exception';
import { InternalServerErrorException } from './internal-server-error.exception';
import { NotFoundException } from './not-found.exception';
import { UnauthorizedException } from './unauthorized.exception';

export const BaseExceptions = [
  InternalServerErrorException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
];

export {
  InternalServerErrorException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
};
