import {
  Column as OrmColumn,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from './task.entity';

@Entity('columns')
export class BoardColumn {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OrmColumn()
  title!: string;

  @OrmColumn({ type: 'int' })
  orderIndex!: number;

  @OneToMany(() => Task, (task) => task.column, { cascade: true })
  tasks!: Task[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
