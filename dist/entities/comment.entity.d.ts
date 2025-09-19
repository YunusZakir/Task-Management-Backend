import { Task } from './task.entity';
import { User } from './user.entity';
export declare class Comment {
    id: string;
    content: string;
    task: Task;
    author?: User | null;
    createdAt: Date;
}
