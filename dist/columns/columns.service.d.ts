import { Repository } from 'typeorm';
import { BoardColumn } from '../entities/column.entity';
export declare class ColumnsService {
    private readonly columnsRepo;
    constructor(columnsRepo: Repository<BoardColumn>);
    list(filter?: {
        assigneeName?: string;
    }): Promise<BoardColumn[]>;
    create(title: string, orderIndex: number): Promise<{
        title: string;
        orderIndex: number;
    } & BoardColumn>;
    update(id: string, data: Partial<BoardColumn>): Promise<{
        id: string;
        title?: string | undefined;
        orderIndex?: number | undefined;
        tasks?: import("../entities/task.entity").Task[] | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
    } & BoardColumn>;
    remove(id: string): Promise<{
        id: string;
    }>;
    reorder(idsInOrder: string[]): Promise<BoardColumn[]>;
}
