import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { BoardColumn } from '../entities/column.entity';
import { User } from '../entities/user.entity';
import { HistoryService } from '../history/history.service';
export declare class TasksService {
    private readonly tasksRepo;
    private readonly columnsRepo;
    private readonly usersRepo;
    private readonly history;
    constructor(tasksRepo: Repository<Task>, columnsRepo: Repository<BoardColumn>, usersRepo: Repository<User>, history: HistoryService);
    create(data: {
        title: string;
        description?: string;
        orderIndex: number;
        columnId: string;
        assigneeIds?: string[];
        priority?: 'low' | 'medium' | 'high';
        dueDate?: string | null;
        labels?: string | null;
    }, actorId?: string): Promise<{
        title: string;
        description: string | undefined;
        orderIndex: number;
        priority: any;
        dueDate: string | null;
        labels: string | null;
        column: BoardColumn;
        assignees: User[];
    } & Task>;
    update(id: string, data: Partial<{
        title: string;
        description: string;
        orderIndex: number;
        columnId: string;
        priority: 'low' | 'medium' | 'high';
        dueDate: string | null;
        labels: string | null;
        assigneeIds: string[] | null;
    }>, actorId?: string): Promise<Partial<Task> & {
        id: string;
    } & Task>;
    remove(id: string): Promise<{
        id: string;
    }>;
}
