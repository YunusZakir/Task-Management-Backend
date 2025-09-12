import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findOne(id: string): Promise<import("../entities/user.entity").User | null>;
    list(): Promise<import("../entities/user.entity").User[]>;
}
