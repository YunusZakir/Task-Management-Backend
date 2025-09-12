"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_entity_1 = require("./entities/user.entity");
const column_entity_1 = require("./entities/column.entity");
const task_entity_1 = require("./entities/task.entity");
const invite_entity_1 = require("./entities/invite.entity");
const users_module_1 = require("./users/users.module");
const columns_module_1 = require("./columns/columns.module");
const tasks_module_1 = require("./tasks/tasks.module");
const invites_module_1 = require("./invites/invites.module");
const auth_module_1 = require("./auth/auth.module");
const mailer_service_1 = require("./mailer/mailer.service");
const startup_service_1 = require("./startup.service");
const config_2 = require("./config");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [() => config_2.config],
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: config_2.config.database.host,
                port: config_2.config.database.port,
                username: config_2.config.database.username,
                password: config_2.config.database.password,
                database: config_2.config.database.database,
                entities: [user_entity_1.User, column_entity_1.BoardColumn, task_entity_1.Task, invite_entity_1.Invite],
                synchronize: true,
                logging: process.env.NODE_ENV !== 'production',
            }),
            users_module_1.UsersModule,
            columns_module_1.ColumnsModule,
            tasks_module_1.TasksModule,
            invites_module_1.InvitesModule,
            auth_module_1.AuthModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, mailer_service_1.MailerService, startup_service_1.StartupService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map