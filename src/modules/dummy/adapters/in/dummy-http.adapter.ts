import { Controller, Get, Inject } from '@nestjs/common';

import { IDummyUseCase } from '@/modules/dummy';
import { DUMMY_HTTP_ROUTES, DUMMY_TOKEN } from '@/modules/dummy/ports';

@Controller(DUMMY_HTTP_ROUTES.BASE)
export class DummyHttpAdapter {
  constructor(
    @Inject(DUMMY_TOKEN.USE_CASE)
    private readonly useCase: IDummyUseCase,
  ) {}

  @Get()
  public async get(): Promise<{ ok: boolean }> {
    await this.useCase.execute();
    return {
      ok: true,
    };
  }
}
