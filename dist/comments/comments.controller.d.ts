import { CommentsService } from './comments.service';
export declare class CommentsController {
    private readonly comments;
    constructor(comments: CommentsService);
    list(taskId: string): Promise<import("../entities/comment.entity").Comment[]>;
    add(taskId: string, body: {
        content: string;
    }, req: any): Promise<import("../entities/comment.entity").Comment>;
}
