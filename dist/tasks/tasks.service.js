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
const history_service_1 = require("../history/history.service");
let TasksService = class TasksService {
    constructor(tasksRepo, columnsRepo, usersRepo, history) {
        this.tasksRepo = tasksRepo;
        this.columnsRepo = columnsRepo;
        this.usersRepo = usersRepo;
        this.history = history;
    }
    async create(data, actorId) {
        const column = await this.columnsRepo.findOne({
            where: { id: data.columnId },
        });
        if (!column)
            throw new common_1.NotFoundException('Column not found');
        const assignees = data.assigneeIds && data.assigneeIds.length
            ? await this.usersRepo.find({ where: { id: (0, typeorm_2.In)(data.assigneeIds) } })
            : [];
        const saved = await this.tasksRepo.save({
            title: data.title,
            description: data.description,
            orderIndex: data.orderIndex,
            priority: (data.priority || 'medium'),
            dueDate: data.dueDate ?? null,
            labels: data.labels ?? null,
            column,
            assignees,
        });
        await this.history.log({ taskId: saved.id, actorId, action: 'create' });
        return saved;
    }
    async update(id, data, actorId) {
        const existing = await this.tasksRepo.findOne({ where: { id }, relations: ['column', 'assignees'] });
        if (!existing)
            throw new common_1.NotFoundException('Task not found');
        const partial = { id };
        if (typeof data.title !== 'undefined')
            partial.title = data.title;
        if (typeof data.description !== 'undefined')
            partial.description = data.description;
        if (typeof data.orderIndex !== 'undefined')
            partial.orderIndex = data.orderIndex;
        if (typeof data.columnId !== 'undefined')
            partial.column = { id: data.columnId };
        if (typeof data.priority !== 'undefined')
            partial.priority = data.priority;
        if (typeof data.dueDate !== 'undefined')
            partial.dueDate = data.dueDate ?? null;
        if (typeof data.labels !== 'undefined')
            partial.labels = (data.labels ?? null);
        if (typeof data.assigneeIds !== 'undefined') {
            partial.assignees = Array.isArray(data.assigneeIds)
                ? data.assigneeIds.map((id) => ({ id }))
                : [];
        }
        const updated = await this.tasksRepo.save(partial);
        if (typeof data.title !== 'undefined' && data.title !== existing.title) {
            await this.history.log({ taskId: id, actorId, action: 'update', field: 'title', oldValue: existing.title, newValue: data.title });
        }
        if (typeof data.description !== 'undefined' && (data.description || '') !== (existing.description || '')) {
            await this.history.log({ taskId: id, actorId, action: 'update', field: 'description', oldValue: existing.description || '', newValue: data.description || '' });
        }
        if (typeof data.orderIndex !== 'undefined' && data.orderIndex !== existing.orderIndex) {
            await this.history.log({ taskId: id, actorId, action: 'update', field: 'orderIndex', oldValue: String(existing.orderIndex), newValue: String(data.orderIndex) });
        }
        if (typeof data.columnId !== 'undefined' && data.columnId !== existing.column.id) {
            await this.history.log({ taskId: id, actorId, action: 'move', field: 'column', oldValue: existing.column.id, newValue: data.columnId });
        }
        if (typeof data.priority !== 'undefined' && data.priority !== existing.priority) {
            await this.history.log({ taskId: id, actorId, action: 'update', field: 'priority', oldValue: existing.priority, newValue: data.priority });
        }
        if (typeof data.dueDate !== 'undefined' && (data.dueDate || '') !== (existing.dueDate || '')) {
            await this.history.log({ taskId: id, actorId, action: 'update', field: 'dueDate', oldValue: existing.dueDate || '', newValue: data.dueDate || '' });
        }
        if (typeof data.labels !== 'undefined' && (data.labels || '') !== (existing.labels || '')) {
            await this.history.log({ taskId: id, actorId, action: 'update', field: 'assignees', oldValue: existing.labels || '', newValue: data.labels || '' });
        }
        if (typeof data.assigneeIds !== 'undefined') {
            const before = new Set((existing.assignees || []).map((a) => a.id));
            const after = new Set(Array.isArray(data.assigneeIds) ? data.assigneeIds : []);
            for (const a of after)
                if (!before.has(a))
                    await this.history.log({ taskId: id, actorId, action: 'assign', field: 'assignees', newValue: a });
            for (const b of before)
                if (!after.has(b))
                    await this.history.log({ taskId: id, actorId, action: 'unassign', field: 'assignees', oldValue: b });
        }
        return updated;
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
        typeorm_2.Repository,
        history_service_1.HistoryService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map