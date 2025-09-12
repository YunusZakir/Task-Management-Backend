import { AppService } from './app.service';
import { UsersService } from './users/users.service';
export declare class AppController {
    private readonly appService;
    private readonly usersService;
    constructor(appService: AppService, usersService: UsersService);
    getHello(): Promise<string>;
}
