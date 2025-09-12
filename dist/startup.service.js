"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartupService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users/users.service");
const config_1 = require("./config");
let StartupService = class StartupService {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async onModuleInit() {
        try {
            await this.usersService.createAdminIfMissing(config_1.config.admin.email, config_1.config.admin.password);
            console.log('Admin user check completed successfully');
        }
        catch (error) {
            console.error('Error during startup:', error);
            throw error;
        }
    }
};
exports.StartupService = StartupService;
exports.StartupService = StartupService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], StartupService);
//# sourceMappingURL=startup.service.js.map