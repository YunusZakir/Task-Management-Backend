import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { AdminOnly } from '../auth/roles.decorator';
import { ColumnsService } from './columns.service';

@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Get()
  list(@Query('assignee') assignee?: string) {
    return this.columnsService.list(assignee ? { assigneeName: assignee } : undefined);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AdminOnly()
  @Post()
  create(@Body() body: { title: string; orderIndex: number }) {
    return this.columnsService.create(body.title, body.orderIndex);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AdminOnly()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: { title?: string; orderIndex?: number },
  ) {
    return this.columnsService.update(id, body);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AdminOnly()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.columnsService.remove(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('reorder/all')
  reorder(@Body() body: { ids: string[] }) {
    return this.columnsService.reorder(body.ids);
  }
}
