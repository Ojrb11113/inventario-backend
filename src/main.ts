import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AllExceptionFilter } from './common/utils/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173/',
    credentials: true
  });
  app.use(cookieParser());

  const logger = new Logger('bootstrap');

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('PuraRaza')
    .setDescription('PuraRaza backend')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  app.useGlobalFilters(new AllExceptionFilter());

  await app.listen(process.env.PORT || 3000);
  logger.log(`server running on port ${process.env.PORT}`);
}
bootstrap();
