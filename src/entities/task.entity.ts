import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  JoinTable,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BoardColumn } from './column.entity';
import { User } from './user.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'int' })
  orderIndex!: number;

  // Task priority: low, medium, high
  @Column({ type: 'varchar', length: 10, default: 'medium' })
  priority!: 'low' | 'medium' | 'high';

  // Optional due date
  @Column({ type: 'date', nullable: true })
  dueDate?: string | null;

  // Comma-separated labels/tags for simplicity
  @Column({ type: 'text', nullable: true })
  labels?: string | null;

  @ManyToOne(() => BoardColumn, (column) => column.tasks, {
    onDelete: 'CASCADE',
  })
  column!: BoardColumn;

  @ManyToMany(() => User, {
    cascade: false,
  })
  @JoinTable({ name: 'task_assignees' })
  assignees?: User[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
