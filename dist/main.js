"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const config_1 = require("./config");
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.enableCors({
            origin: config_1.config.cors.origin,
            credentials: true,
        });
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }));
        await app.listen(config_1.config.server.port);
        console.log(`Application is running on: http://localhost:${config_1.config.server.port}`);
    }
    catch (error) {
        console.error('Error starting the application:', error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map