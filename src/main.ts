import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { config } from './config';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    
    // CORS configuration
    app.enableCors({ 
      origin: config.cors.origin,
      credentials: true 
    });
    
    // Global pipes
    app.useGlobalPipes(
      new ValidationPipe({ 
        whitelist: true, 
        transform: true,
        forbidNonWhitelisted: true,
      })
    );

    await app.listen(config.server.port);
    console.log(`Application is running on: http://localhost:${config.server.port}`);
  } catch (error) {
    console.error('Error starting the application:', error);
    process.exit(1);
  }
}

bootstrap();
