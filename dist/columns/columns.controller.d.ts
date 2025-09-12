import { ColumnsService } from './columns.service';
export declare class ColumnsController {
    private readonly columnsService;
    constructor(columnsService: ColumnsService);
    list(assignee?: string): Promise<import("../entities/column.entity").BoardColumn[]>;
    create(body: {
        title: string;
        orderIndex: number;
    }): Promise<{
        title: string;
        orderIndex: number;
    } & import("../entities/column.entity").BoardColumn>;
    update(id: string, body: {
        title?: string;
        orderIndex?: number;
    }): Promise<{
        id: string;
        title?: string | undefined;
        orderIndex?: number | undefined;
        tasks?: import("../entities/task.entity").Task[] | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
    } & import("../entities/column.entity").BoardColumn>;
    remove(id: string): Promise<{
        id: string;
    }>;
    reorder(body: {
        ids: string[];
    }): Promise<import("../entities/column.entity").BoardColumn[]>;
}
