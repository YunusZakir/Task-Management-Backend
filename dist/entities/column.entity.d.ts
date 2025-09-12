import { Task } from './task.entity';
export declare class BoardColumn {
    id: string;
    title: string;
    orderIndex: number;
    tasks: Task[];
    createdAt: Date;
    updatedAt: Date;
}
