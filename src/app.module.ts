import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ColumnsModule } from './columns/columns.module';
import { TasksModule } from './tasks/tasks.module';
import { InvitesModule } from './invites/invites.module';
import { AuthModule } from './auth/auth.module';
import { MailerService } from './mailer/mailer.service';
import { CommentsModule } from './comments/comments.module';
import { HistoryModule } from './history/history.module';
import { StartupService } from './startup.service';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT') || '5432', 10),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // ⚠️ disable in production, use migrations
        ssl:
          process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),
    UsersModule,
    ColumnsModule,
    TasksModule,
    InvitesModule,
    AuthModule,
    CommentsModule,
    HistoryModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, MailerService, StartupService],
})
export class AppModule {}

