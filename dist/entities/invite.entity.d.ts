import { User } from './user.entity';
export declare class Invite {
    id: string;
    token: string;
    email: string;
    acceptedAt?: Date | null;
    invitedBy?: User | null;
    createdAt: Date;
}
