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
import { StartupService } from './startup.service';

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
        url: configService.get<string>('DATABASE_URL'),
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
  ],
  controllers: [AppController],
  providers: [AppService, MailerService, StartupService],
})
export class AppModule {}
