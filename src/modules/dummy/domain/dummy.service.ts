import { Inject, Injectable, Logger } from '@nestjs/common';
import { DUMMY_DI } from '@/modules/dummy/dummy.di';
import { IDummyPort, IDummyUseCase } from '@/modules/dummy/ports';

@Injectable()
export class DummyService implements IDummyUseCase {
  constructor(
    @Inject(DUMMY_DI.REPOSITORY)
    private readonly repo: IDummyPort,
  ) {}

  private readonly logger = new Logger(DummyService.name);

  public async execute(): Promise<void> {
    await this.repo.find();
    this.logger.log('Dummy executed!');
  }
}
