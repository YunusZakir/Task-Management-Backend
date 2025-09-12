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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_entity_1 = require("../entities/task.entity");
const column_entity_1 = require("../entities/column.entity");
const user_entity_1 = require("../entities/user.entity");
let TasksService = class TasksService {
    constructor(tasksRepo, columnsRepo, usersRepo) {
        this.tasksRepo = tasksRepo;
        this.columnsRepo = columnsRepo;
        this.usersRepo = usersRepo;
    }
    async create(data) {
        const column = await this.columnsRepo.findOne({
            where: { id: data.columnId },
        });
        if (!column)
            throw new common_1.NotFoundException('Column not found');
        const assignees = data.assigneeIds && data.assigneeIds.length
            ? await this.usersRepo.find({ where: { id: (0, typeorm_2.In)(data.assigneeIds) } })
            : [];
        return this.tasksRepo.save({
            title: data.title,
            description: data.description,
            orderIndex: data.orderIndex,
            column,
            assignees,
        });
    }
    update(id, data) {
        const partial = { id };
        if (typeof data.title !== 'undefined')
            partial.title = data.title;
        if (typeof data.description !== 'undefined')
            partial.description = data.description;
        if (typeof data.orderIndex !== 'undefined')
            partial.orderIndex = data.orderIndex;
        if (typeof data.columnId !== 'undefined')
            partial.column = { id: data.columnId };
        if (typeof data.assigneeIds !== 'undefined') {
            partial.assignees = Array.isArray(data.assigneeIds)
                ? data.assigneeIds.map((id) => ({ id }))
                : [];
        }
        return this.tasksRepo.save(partial);
    }
    async remove(id) {
        await this.tasksRepo.delete(id);
        return { id };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(1, (0, typeorm_1.InjectRepository)(column_entity_1.BoardColumn)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TasksService);
//# sourceMappingURL=tasks.service.js.map