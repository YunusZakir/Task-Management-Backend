import { HistoryService } from './history.service';
export declare class HistoryController {
    private readonly history;
    constructor(history: HistoryService);
    list(taskId: string): Promise<import("../entities/history.entity").TaskHistory[]>;
}
