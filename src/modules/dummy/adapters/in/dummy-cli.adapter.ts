import { Inject } from '@nestjs/common';

import { CliCommand, ICliCommand } from '@/modules/cli';
import { DUMMY_CLI_COMMANDS, DUMMY_TOKEN, IDummyUseCase } from '@/modules/dummy/ports';

@CliCommand({
  name: DUMMY_CLI_COMMANDS.EXECUTE,
  description: 'Запуск бизнес-логики dummy через консоль',
})
export class DummyCliAdapter implements ICliCommand {
  constructor(
    @Inject(DUMMY_TOKEN.USE_CASE)
    private readonly useCase: IDummyUseCase,
  ) {}

  public async execute(): Promise<void> {
    await this.useCase.execute();
  }
}
