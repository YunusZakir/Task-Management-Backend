import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { BoardColumn } from '../entities/column.entity';
import { User } from '../entities/user.entity';
import { HistoryService } from '../history/history.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly tasksRepo: Repository<Task>,
    @InjectRepository(BoardColumn)
    private readonly columnsRepo: Repository<BoardColumn>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    private readonly history: HistoryService,
  ) {}

  async create(data: {
    title: string;
    description?: string;
    orderIndex: number;
    columnId: string;
    assigneeIds?: string[];
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string | null;
    labels?: string | null;
  }, actorId?: string) {
    const column = await this.columnsRepo.findOne({
      where: { id: data.columnId },
    });
    if (!column) throw new NotFoundException('Column not found');
    const assignees =
      data.assigneeIds && data.assigneeIds.length
        ? await this.usersRepo.find({ where: { id: In(data.assigneeIds) } })
        : [];
    const saved = await this.tasksRepo.save({
      title: data.title,
      description: data.description,
      orderIndex: data.orderIndex,
      priority: (data.priority || 'medium') as any,
      dueDate: data.dueDate ?? null,
      labels: data.labels ?? null,
      column,
      assignees,
    });
    await this.history.log({ taskId: saved.id, actorId, action: 'create' });
    return saved;
  }

  async update(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      orderIndex: number;
      columnId: string;
      priority: 'low' | 'medium' | 'high';
      dueDate: string | null;
      labels: string | null;
      assigneeIds: string[] | null;
    }>,
    actorId?: string,
  ) {
    const existing = await this.tasksRepo.findOne({ where: { id }, relations: ['column', 'assignees'] });
    if (!existing) throw new NotFoundException('Task not found');

    const partial: Partial<Task> & { id: string } = { id };
    if (typeof data.title !== 'undefined') partial.title = data.title;
    if (typeof data.description !== 'undefined') partial.description = data.description;
    if (typeof data.orderIndex !== 'undefined') partial.orderIndex = data.orderIndex;
    if (typeof data.columnId !== 'undefined') partial.column = { id: data.columnId } as BoardColumn;
    if (typeof data.priority !== 'undefined') partial.priority = data.priority as any;
    if (typeof data.dueDate !== 'undefined') partial.dueDate = data.dueDate ?? null;
    if (typeof data.labels !== 'undefined') partial.labels = (data.labels ?? null);
    if (typeof data.assigneeIds !== 'undefined') {
      partial.assignees = Array.isArray(data.assigneeIds)
        ? data.assigneeIds.map((id) => ({ id }) as User)
        : [];
    }
    const updated = await this.tasksRepo.save(partial);

    // log changes
    if (typeof data.title !== 'undefined' && data.title !== existing.title) {
      await this.history.log({ taskId: id, actorId, action: 'update', field: 'title', oldValue: existing.title, newValue: data.title });
    }
    if (typeof data.description !== 'undefined' && (data.description || '') !== (existing.description || '')) {
      await this.history.log({ taskId: id, actorId, action: 'update', field: 'description', oldValue: existing.description || '', newValue: data.description || '' });
    }
    if (typeof data.orderIndex !== 'undefined' && data.orderIndex !== existing.orderIndex) {
      await this.history.log({ taskId: id, actorId, action: 'update', field: 'orderIndex', oldValue: String(existing.orderIndex), newValue: String(data.orderIndex) });
    }
    if (typeof data.columnId !== 'undefined' && data.columnId !== existing.column.id) {
      await this.history.log({ taskId: id, actorId, action: 'move', field: 'column', oldValue: existing.column.id, newValue: data.columnId });
    }
    if (typeof data.priority !== 'undefined' && data.priority !== existing.priority) {
      await this.history.log({ taskId: id, actorId, action: 'update', field: 'priority', oldValue: existing.priority, newValue: data.priority });
    }
    if (typeof data.dueDate !== 'undefined' && (data.dueDate || '') !== (existing.dueDate || '')) {
      await this.history.log({ taskId: id, actorId, action: 'update', field: 'dueDate', oldValue: existing.dueDate || '', newValue: data.dueDate || '' });
    }
    if (typeof data.labels !== 'undefined' && (data.labels || '') !== (existing.labels || '')) {
      await this.history.log({ taskId: id, actorId, action: 'update', field: 'assignees', oldValue: existing.labels || '', newValue: data.labels || '' });
    }
    if (typeof data.assigneeIds !== 'undefined') {
      const before = new Set((existing.assignees || []).map((a) => a.id));
      const after = new Set(Array.isArray(data.assigneeIds) ? data.assigneeIds : []);
      for (const a of after) if (!before.has(a)) await this.history.log({ taskId: id, actorId, action: 'assign', field: 'assignees', newValue: a });
      for (const b of before) if (!after.has(b)) await this.history.log({ taskId: id, actorId, action: 'unassign', field: 'assignees', oldValue: b });
    }
    return updated;
  }

  async remove(id: string) {
    await this.tasksRepo.delete(id);
    return { id };
  }
}
