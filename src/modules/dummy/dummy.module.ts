import { Module } from '@nestjs/common';

import { DummyCliAdapter, DummyHttpAdapter, DummyRepository } from './adapters';
import { DummyService } from './domain';
import { DUMMY_TOKEN } from './ports';

@Module({
  controllers: [DummyHttpAdapter],
  providers: [
    DummyCliAdapter,
    {
      provide: DUMMY_TOKEN.USE_CASE,
      useClass: DummyService,
    },
    {
      provide: DUMMY_TOKEN.REPOSITORY,
      useClass: DummyRepository,
    },
  ],
})
export class DummyModule {}
