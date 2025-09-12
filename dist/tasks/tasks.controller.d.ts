import { TasksService } from './tasks.service';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(body: {
        title: string;
        description?: string;
        orderIndex: number;
        columnId: string;
        assigneeIds?: string[];
    }): Promise<{
        title: string;
        description: string | undefined;
        orderIndex: number;
        column: import("../entities/column.entity").BoardColumn;
        assignees: import("../entities/user.entity").User[];
    } & import("../entities/task.entity").Task>;
    update(id: string, body: Partial<{
        title: string;
        description: string;
        orderIndex: number;
        columnId: string;
        assigneeIds: string[] | null;
    }>): Promise<Partial<import("../entities/task.entity").Task> & {
        id: string;
    } & import("../entities/task.entity").Task>;
    remove(id: string): Promise<{
        id: string;
    }>;
}
