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
const users_module_1 = require("./users/users.module");
const columns_module_1 = require("./columns/columns.module");
const tasks_module_1 = require("./tasks/tasks.module");
const invites_module_1 = require("./invites/invites.module");
const auth_module_1 = require("./auth/auth.module");
const mailer_service_1 = require("./mailer/mailer.service");
const comments_module_1 = require("./comments/comments.module");
const history_module_1 = require("./history/history.module");
const startup_service_1 = require("./startup.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST'),
                    port: parseInt(configService.get('DB_PORT') || '5432', 10),
                    username: configService.get('DB_USER'),
                    password: configService.get('DB_PASS'),
                    database: configService.get('DB_NAME'),
                    autoLoadEntities: true,
                    synchronize: true,
                    ssl: process.env.NODE_ENV === 'production'
                        ? { rejectUnauthorized: false }
                        : false,
                }),
            }),
            users_module_1.UsersModule,
            columns_module_1.ColumnsModule,
            tasks_module_1.TasksModule,
            invites_module_1.InvitesModule,
            auth_module_1.AuthModule,
            comments_module_1.CommentsModule,
            history_module_1.HistoryModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, mailer_service_1.MailerService, startup_service_1.StartupService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map