import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
export declare class UsersService {
    private readonly usersRepo;
    constructor(usersRepo: Repository<User>);
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    createAdminIfMissing(email: string, password: string): Promise<User>;
}
