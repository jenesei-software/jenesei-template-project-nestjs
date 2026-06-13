import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { ApiOkResponseWrapped, ObjectResponseDto } from '@/common';
import { CliCommandRegistryService } from '@/modules/cli/domain';
import { CLI_HTTP_ROUTE } from '@/modules/cli/ports';
import { ExecuteCommandDto } from './dto';

@ApiTags('CLI')
@ApiExcludeController()
@Controller(CLI_HTTP_ROUTE.BASE)
export class CliHttpAdapter {
  constructor(private readonly registry: CliCommandRegistryService) {}

  @ApiOkResponseWrapped(ObjectResponseDto)
  @Post(CLI_HTTP_ROUTE.EXECUTE)
  public async execute(@Body() dto: ExecuteCommandDto): Promise<ObjectResponseDto> {
    const { command, payload } = dto;
    const targetCommand = this.registry.get(command);

    if (!targetCommand) {
      throw new NotFoundException(`Команда "${command}" не зарегистрирована на сервере`);
    }

    const result = await targetCommand.execute(payload);
    const response = result || { message: 'success' };

    return response as unknown as ObjectResponseDto;
  }
}
