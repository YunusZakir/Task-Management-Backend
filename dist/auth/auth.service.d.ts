import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { Invite } from '../entities/invite.entity';
export declare class AuthService {
    private readonly inviteRepository;
    private readonly userRepository;
    private readonly jwtService;
    constructor(inviteRepository: Repository<Invite>, userRepository: Repository<User>, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<{
        id: string;
        email: string;
        isAdmin: boolean;
        name?: string;
        collaboratingTasks: import("../entities/task.entity").Task[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(email: string, password: string): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            isAdmin: boolean;
            name: string | undefined;
        };
    }>;
}
