import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Task } from './task.entity';
import { User } from './user.entity';

@Entity('task_history')
export class TaskHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Task, { onDelete: 'CASCADE' })
  task!: Task;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  actor?: User | null;

  @Column({ type: 'varchar', length: 32 })
  action!: 'create' | 'update' | 'delete' | 'assign' | 'unassign' | 'move';

  @Column({ type: 'varchar', length: 32, nullable: true })
  field?: 'title' | 'description' | 'priority' | 'dueDate' | 'orderIndex' | 'column' | 'assignees' | null;

  @Column({ type: 'text', nullable: true })
  oldValue?: string | null;

  @Column({ type: 'text', nullable: true })
  newValue?: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
