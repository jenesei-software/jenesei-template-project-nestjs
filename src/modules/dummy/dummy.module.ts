import { Module } from '@nestjs/common';
import { DummyCliAdapter, DummyHttpAdapter, DummyRepository } from './adapters';
import { DummyService } from './domain';
import { DUMMY_DI } from './dummy.di';

@Module({
  controllers: [DummyHttpAdapter],
  providers: [
    DummyCliAdapter,
    {
      provide: DUMMY_DI.USE_CASE,
      useClass: DummyService,
    },
    {
      provide: DUMMY_DI.REPOSITORY,
      useClass: DummyRepository,
    },
  ],
})
export class DummyModule {}
