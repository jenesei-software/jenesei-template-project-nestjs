import { BadRequestException } from './bad-request.exception';
import { ForbiddenException } from './forbidden.exception';
import { InterServerException } from './internal-server.exception';
import { NotFoundException } from './not-found.exception';
import { UnauthorizedException } from './unauthorized.exception';

export const BaseExceptions = [
  InterServerException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
];

export {
  InterServerException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
};
