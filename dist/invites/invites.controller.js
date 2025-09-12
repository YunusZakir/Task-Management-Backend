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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const invites_service_1 = require("./invites.service");
const mailer_service_1 = require("../mailer/mailer.service");
let InvitesController = class InvitesController {
    constructor(invitesService, mailer) {
        this.invitesService = invitesService;
        this.mailer = mailer;
    }
    async create(body) {
        const inv = await this.invitesService.create(body.email);
        const linkBase = process.env.APP_URL || 'http://localhost:4200';
        const inviteLink = `${linkBase}/accept-invite?token=${inv.token}`;
        await this.mailer.sendInviteEmail(inv.email, inviteLink);
        return inv;
    }
    get(token) {
        return this.invitesService.findByToken(token);
    }
};
exports.InvitesController = InvitesController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.AdminOnly)(),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvitesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InvitesController.prototype, "get", null);
exports.InvitesController = InvitesController = __decorate([
    (0, common_1.Controller)('invites'),
    __metadata("design:paramtypes", [invites_service_1.InvitesService, mailer_service_1.MailerService])
], InvitesController);
//# sourceMappingURL=invites.controller.js.map