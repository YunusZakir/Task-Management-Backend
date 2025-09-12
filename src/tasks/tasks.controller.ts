import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { RolesGuard } from '../auth/roles.guard';
import { AdminOnly } from '../auth/roles.decorator';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AdminOnly()
  @Post()
  create(
    @Body()
    body: {
      title: string;
      description?: string;
      orderIndex: number;
      columnId: string;
      assigneeIds?: string[];
    },
  ) {
    return this.tasksService.create(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      title: string;
      description: string;
      orderIndex: number;
      columnId: string;
      assigneeIds: string[] | null;
    }>,
  ) {
    return this.tasksService.update(id, body);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AdminOnly()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
