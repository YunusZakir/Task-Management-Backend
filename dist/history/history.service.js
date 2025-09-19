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
exports.HistoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const history_entity_1 = require("../entities/history.entity");
const task_entity_1 = require("../entities/task.entity");
const user_entity_1 = require("../entities/user.entity");
let HistoryService = class HistoryService {
    constructor(historyRepo, tasksRepo, usersRepo) {
        this.historyRepo = historyRepo;
        this.tasksRepo = tasksRepo;
        this.usersRepo = usersRepo;
    }
    async list(taskId) {
        return this.historyRepo.find({
            where: { task: { id: taskId } },
            relations: ['actor'],
            order: { createdAt: 'ASC' },
        });
    }
    async log(params) {
        const task = await this.tasksRepo.findOne({ where: { id: params.taskId } });
        if (!task)
            return;
        const actor = params.actorId ? await this.usersRepo.findOne({ where: { id: params.actorId } }) : null;
        const entry = this.historyRepo.create({
            task,
            actor: actor || null,
            action: params.action,
            field: params.field || null,
            oldValue: params.oldValue ?? null,
            newValue: params.newValue ?? null,
        });
        await this.historyRepo.save(entry);
    }
};
exports.HistoryService = HistoryService;
exports.HistoryService = HistoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(history_entity_1.TaskHistory)),
    __param(1, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], HistoryService);
//# sourceMappingURL=history.service.js.map