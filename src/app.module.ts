import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { BoardColumn } from './entities/column.entity';
import { Task } from './entities/task.entity';
import { Invite } from './entities/invite.entity';
import { UsersModule } from './users/users.module';
import { ColumnsModule } from './columns/columns.module';
import { TasksModule } from './tasks/tasks.module';
import { InvitesModule } from './invites/invites.module';
import { AuthModule } from './auth/auth.module';
import { MailerService } from './mailer/mailer.service';
import { StartupService } from './startup.service';
import { config } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => config],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.database,
      entities: [User, BoardColumn, Task, Invite],
      synchronize: true, // Don't use in production!
      logging: process.env.NODE_ENV !== 'production',
    }),
    UsersModule,
    ColumnsModule,
    TasksModule,
    InvitesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailerService, StartupService],
})
export class AppModule {}
