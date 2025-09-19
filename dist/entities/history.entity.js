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
exports.TaskHistory = void 0;
const typeorm_1 = require("typeorm");
const task_entity_1 = require("./task.entity");
const user_entity_1 = require("./user.entity");
let TaskHistory = class TaskHistory {
};
exports.TaskHistory = TaskHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TaskHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => task_entity_1.Task, { onDelete: 'CASCADE' }),
    __metadata("design:type", task_entity_1.Task)
], TaskHistory.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'SET NULL', nullable: true }),
    __metadata("design:type", Object)
], TaskHistory.prototype, "actor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 32 }),
    __metadata("design:type", String)
], TaskHistory.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 32, nullable: true }),
    __metadata("design:type", Object)
], TaskHistory.prototype, "field", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], TaskHistory.prototype, "oldValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], TaskHistory.prototype, "newValue", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TaskHistory.prototype, "createdAt", void 0);
exports.TaskHistory = TaskHistory = __decorate([
    (0, typeorm_1.Entity)('task_history')
], TaskHistory);
//# sourceMappingURL=history.entity.js.map