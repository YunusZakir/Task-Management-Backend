import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Task } from './task.entity';
import { User } from './user.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  content!: string;

  @ManyToOne(() => Task, { onDelete: 'CASCADE' })
  task!: Task;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  author?: User | null;

  @CreateDateColumn()
  createdAt!: Date;
}
