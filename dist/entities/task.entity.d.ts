import { BoardColumn } from './column.entity';
import { User } from './user.entity';
export declare class Task {
    id: string;
    title: string;
    description?: string;
    orderIndex: number;
    column: BoardColumn;
    assignees?: User[];
    createdAt: Date;
    updatedAt: Date;
}
