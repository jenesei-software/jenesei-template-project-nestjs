import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponseWrapped } from '@/common';
import { DUMMY_TOKEN, IDummyUseCase } from '@/modules/dummy';
import { DUMMY_HTTP_ROUTES } from '@/modules/dummy/ports';

@Controller(DUMMY_HTTP_ROUTES.BASE)
export class DummyHttpAdapter {
  constructor(
    @Inject(DUMMY_TOKEN.USE_CASE)
    private readonly useCase: IDummyUseCase,
  ) {}

  @ApiOkResponseWrapped()
  @Get()
  public async get(): Promise<void> {
    await this.useCase.execute();
  }
}
