import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { config } from './config';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // CORS configuration
    app.enableCors({
      origin: ["https://task-management-frontend-ew3l.vercel.app"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    });

    // Global pipes
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    const port = config.server.port;
    await app.listen(port, '0.0.0.0');
    console.log(`Application is running on port ${port}`);
  } catch (error) {
    console.error('Error starting the application:', error);
    process.exit(1);
  }
}

bootstrap();
