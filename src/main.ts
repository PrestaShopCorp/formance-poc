import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './application/application.module';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  await app.listen(process.env.APP_PORT);
}
bootstrap();
