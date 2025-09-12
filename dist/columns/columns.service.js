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
exports.ColumnsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const column_entity_1 = require("../entities/column.entity");
let ColumnsService = class ColumnsService {
    constructor(columnsRepo) {
        this.columnsRepo = columnsRepo;
    }
    async list(filter) {
        const columns = await this.columnsRepo.find({
            order: { orderIndex: 'ASC' },
            relations: ['tasks', 'tasks.assignees'],
        });
        if (filter?.assigneeName) {
            const needle = filter.assigneeName.toLowerCase();
            for (const col of columns) {
                col.tasks = (col.tasks || []).filter((t) => {
                    const names = (t.assignees || []).map((u) => u.name || u.email || '');
                    return names.some((n) => n.toLowerCase().includes(needle));
                });
            }
        }
        return columns;
    }
    create(title, orderIndex) {
        return this.columnsRepo.save({ title, orderIndex });
    }
    update(id, data) {
        return this.columnsRepo.save({ ...data, id });
    }
    async remove(id) {
        await this.columnsRepo.delete(id);
        return { id };
    }
    async reorder(idsInOrder) {
        const updates = idsInOrder.map((id, idx) => ({ id, orderIndex: idx }));
        await this.columnsRepo.save(updates);
        return this.list();
    }
};
exports.ColumnsService = ColumnsService;
exports.ColumnsService = ColumnsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(column_entity_1.BoardColumn)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ColumnsService);
//# sourceMappingURL=columns.service.js.map