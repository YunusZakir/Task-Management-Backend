import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HistoryService } from './history.service';

@Controller('tasks/:taskId/history')
export class HistoryController {
  constructor(private readonly history: HistoryService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  list(@Param('taskId') taskId: string) {
    return this.history.list(taskId);
  }
}
