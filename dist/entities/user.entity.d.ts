import { Task } from './task.entity';
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    isAdmin: boolean;
    name?: string;
    collaboratingTasks: Task[];
    createdAt: Date;
    updatedAt: Date;
    static hashPassword(plain: string): Promise<string>;
}
