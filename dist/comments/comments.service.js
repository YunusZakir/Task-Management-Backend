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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const comment_entity_1 = require("../entities/comment.entity");
const task_entity_1 = require("../entities/task.entity");
const user_entity_1 = require("../entities/user.entity");
let CommentsService = class CommentsService {
    constructor(commentsRepo, tasksRepo, usersRepo) {
        this.commentsRepo = commentsRepo;
        this.tasksRepo = tasksRepo;
        this.usersRepo = usersRepo;
    }
    async list(taskId) {
        return this.commentsRepo.find({
            where: { task: { id: taskId } },
            relations: ['author'],
            order: { createdAt: 'ASC' },
        });
    }
    async add(taskId, authorId, content) {
        const task = await this.tasksRepo.findOne({ where: { id: taskId } });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        const author = authorId ? await this.usersRepo.findOne({ where: { id: authorId } }) : null;
        const comment = this.commentsRepo.create({ content, task, author: author || null });
        return this.commentsRepo.save(comment);
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(1, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CommentsService);
//# sourceMappingURL=comments.service.js.map