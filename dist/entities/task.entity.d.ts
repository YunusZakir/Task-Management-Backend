import { BoardColumn } from './column.entity';
import { User } from './user.entity';
export declare class Task {
    id: string;
    title: string;
    description?: string;
    orderIndex: number;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string | null;
    labels?: string | null;
    column: BoardColumn;
    assignees?: User[];
    createdAt: Date;
    updatedAt: Date;
}
