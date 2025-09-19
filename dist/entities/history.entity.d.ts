import { Task } from './task.entity';
import { User } from './user.entity';
export declare class TaskHistory {
    id: string;
    task: Task;
    actor?: User | null;
    action: 'create' | 'update' | 'delete' | 'assign' | 'unassign' | 'move';
    field?: 'title' | 'description' | 'priority' | 'dueDate' | 'orderIndex' | 'column' | 'assignees' | null;
    oldValue?: string | null;
    newValue?: string | null;
    createdAt: Date;
}
