import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { BoardColumn } from '../entities/column.entity';
import { User } from '../entities/user.entity';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { HistoryModule } from '../history/history.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task, BoardColumn, User]), HistoryModule],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
