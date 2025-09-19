import { Repository } from 'typeorm';
import { TaskHistory } from '../entities/history.entity';
import { Task } from '../entities/task.entity';
import { User } from '../entities/user.entity';
export declare class HistoryService {
    private readonly historyRepo;
    private readonly tasksRepo;
    private readonly usersRepo;
    constructor(historyRepo: Repository<TaskHistory>, tasksRepo: Repository<Task>, usersRepo: Repository<User>);
    list(taskId: string): Promise<TaskHistory[]>;
    log(params: {
        taskId: string;
        actorId?: string | null;
        action: 'create' | 'update' | 'delete' | 'assign' | 'unassign' | 'move';
        field?: 'title' | 'description' | 'priority' | 'dueDate' | 'orderIndex' | 'column' | 'assignees' | null;
        oldValue?: string | null;
        newValue?: string | null;
    }): Promise<void>;
}
