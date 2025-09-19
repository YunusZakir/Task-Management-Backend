import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Task } from '../entities/task.entity';
import { User } from '../entities/user.entity';
export declare class CommentsService {
    private readonly commentsRepo;
    private readonly tasksRepo;
    private readonly usersRepo;
    constructor(commentsRepo: Repository<Comment>, tasksRepo: Repository<Task>, usersRepo: Repository<User>);
    list(taskId: string): Promise<Comment[]>;
    add(taskId: string, authorId: string | null, content: string): Promise<Comment>;
}
