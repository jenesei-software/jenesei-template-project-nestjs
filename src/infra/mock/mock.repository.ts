import { Global } from '@nestjs/common';

@Global()
export class MockRepository {
  private readonly PERSISTENCE = new Map<string, unknown>();
}
