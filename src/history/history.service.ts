import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskHistory } from '../entities/history.entity';
import { Task } from '../entities/task.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(TaskHistory) private readonly historyRepo: Repository<TaskHistory>,
    @InjectRepository(Task) private readonly tasksRepo: Repository<Task>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async list(taskId: string) {
    return this.historyRepo.find({
      where: { task: { id: taskId } },
      relations: ['actor'],
      order: { createdAt: 'ASC' },
    });
  }

  async log(params: {
    taskId: string;
    actorId?: string | null;
    action: 'create' | 'update' | 'delete' | 'assign' | 'unassign' | 'move';
    field?: 'title' | 'description' | 'priority' | 'dueDate' | 'orderIndex' | 'column' | 'assignees' | null;
    oldValue?: string | null;
    newValue?: string | null;
  }) {
    const task = await this.tasksRepo.findOne({ where: { id: params.taskId } });
    if (!task) return;
    const actor = params.actorId ? await this.usersRepo.findOne({ where: { id: params.actorId } }) : null;
    const entry = this.historyRepo.create({
      task,
      actor: actor || null,
      action: params.action,
      field: params.field || null,
      oldValue: params.oldValue ?? null,
      newValue: params.newValue ?? null,
    });
    await this.historyRepo.save(entry);
  }
}
