import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { Invite } from '../entities/invite.entity';
import { User } from '../entities/user.entity';
export declare class AuthController {
    private readonly authService;
    private readonly invitesRepo;
    private readonly usersRepo;
    constructor(authService: AuthService, invitesRepo: Repository<Invite>, usersRepo: Repository<User>);
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            isAdmin: boolean;
            name: string | undefined;
        };
    }>;
    acceptInvite(body: {
        token: string;
        name?: string;
        password: string;
    }): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            isAdmin: boolean;
            name: string | undefined;
        };
    }>;
}
