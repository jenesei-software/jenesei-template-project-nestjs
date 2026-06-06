import { Injectable, Logger } from '@nestjs/common';

import { IDummyPort } from '@/modules/dummy/ports';

@Injectable()
export class DummyRepository implements IDummyPort {
  private readonly logger = new Logger(DummyRepository.name);

  public async find(): Promise<void> {
    this.logger.log('Founded dummy!');
  }
}
