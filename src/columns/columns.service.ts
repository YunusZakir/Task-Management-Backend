import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardColumn } from '../entities/column.entity';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(BoardColumn)
    private readonly columnsRepo: Repository<BoardColumn>,
  ) {}

  async list(filter?: { assigneeName?: string }) {
    const columns = await this.columnsRepo.find({
      order: { orderIndex: 'ASC' },
      relations: ['tasks', 'tasks.assignees'],
    });
    if (filter?.assigneeName) {
      const needle = filter.assigneeName.toLowerCase();
      for (const col of columns) {
        col.tasks = (col.tasks || []).filter((t) => {
          const names = (t.assignees || []).map((u) => u.name || u.email || '');
          return names.some((n) => n.toLowerCase().includes(needle));
        });
      }
    }
    return columns;
  }

  create(title: string, orderIndex: number) {
    return this.columnsRepo.save({ title, orderIndex });
  }

  update(id: string, data: Partial<BoardColumn>) {
    return this.columnsRepo.save({ ...data, id });
  }

  async remove(id: string) {
    await this.columnsRepo.delete(id);
    return { id };
  }

  async reorder(idsInOrder: string[]) {
    const updates = idsInOrder.map((id, idx) => ({ id, orderIndex: idx }));
    await this.columnsRepo.save(updates);
    return this.list();
  }
}
