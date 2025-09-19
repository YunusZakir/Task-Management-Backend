import { Body, Controller, Delete, Param, Patch, Post, UseGuards, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { RolesGuard } from '../auth/roles.guard';
import { AdminOnly } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(RolesGuard)
  @AdminOnly()
  @Post()
  create(
    @Body()
    body: {
      title: string;
      description?: string;
      orderIndex: number;
      columnId: string;
      priority?: 'low' | 'medium' | 'high';
      dueDate?: string | null;
      labels?: string | null;
      assigneeIds?: string[];
    },
    @Req() req: any,
  ) {
    const actorId: string | undefined = req?.user?.id;
    return this.tasksService.create(body, actorId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      title: string;
      description: string;
      orderIndex: number;
      columnId: string;
      priority: 'low' | 'medium' | 'high';
      dueDate: string | null;
      labels: string | null;
      assigneeIds: string[] | null;
    }>,
    @Req() req: any,
  ) {
    const actorId: string | undefined = req?.user?.id;
    return this.tasksService.update(id, body, actorId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @AdminOnly()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
