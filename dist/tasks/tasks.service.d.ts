import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { BoardColumn } from '../entities/column.entity';
import { User } from '../entities/user.entity';
export declare class TasksService {
    private readonly tasksRepo;
    private readonly columnsRepo;
    private readonly usersRepo;
    constructor(tasksRepo: Repository<Task>, columnsRepo: Repository<BoardColumn>, usersRepo: Repository<User>);
    create(data: {
        title: string;
        description?: string;
        orderIndex: number;
        columnId: string;
        assigneeIds?: string[];
    }): Promise<{
        title: string;
        description: string | undefined;
        orderIndex: number;
        column: BoardColumn;
        assignees: User[];
    } & Task>;
    update(id: string, data: Partial<{
        title: string;
        description: string;
        orderIndex: number;
        columnId: string;
        assigneeIds: string[] | null;
    }>): Promise<Partial<Task> & {
        id: string;
    } & Task>;
    remove(id: string): Promise<{
        id: string;
    }>;
}
