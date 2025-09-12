import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { BoardColumn } from '../entities/column.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly tasksRepo: Repository<Task>,
    @InjectRepository(BoardColumn)
    private readonly columnsRepo: Repository<BoardColumn>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async create(data: {
    title: string;
    description?: string;
    orderIndex: number;
    columnId: string;
    assigneeIds?: string[];
  }) {
    const column = await this.columnsRepo.findOne({
      where: { id: data.columnId },
    });
    if (!column) throw new NotFoundException('Column not found');
    const assignees =
      data.assigneeIds && data.assigneeIds.length
        ? await this.usersRepo.find({ where: { id: In(data.assigneeIds) } })
        : [];
    return this.tasksRepo.save({
      title: data.title,
      description: data.description,
      orderIndex: data.orderIndex,
      column,
      assignees,
    });
  }

  update(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      orderIndex: number;
      columnId: string;
      assigneeIds: string[] | null;
    }>,
  ) {
    const partial: Partial<Task> & { id: string } = { id };
    if (typeof data.title !== 'undefined') partial.title = data.title;
    if (typeof data.description !== 'undefined')
      partial.description = data.description;
    if (typeof data.orderIndex !== 'undefined')
      partial.orderIndex = data.orderIndex;
    if (typeof data.columnId !== 'undefined')
      partial.column = { id: data.columnId } as BoardColumn;
    if (typeof data.assigneeIds !== 'undefined') {
      partial.assignees = Array.isArray(data.assigneeIds)
        ? data.assigneeIds.map((id) => ({ id }) as User)
        : [];
    }
    return this.tasksRepo.save(partial);
  }

  async remove(id: string) {
    await this.tasksRepo.delete(id);
    return { id };
  }
}
