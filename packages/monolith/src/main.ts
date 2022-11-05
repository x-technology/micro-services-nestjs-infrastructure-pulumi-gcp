import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'hero',
      protoPath: join(__dirname, '../proto/hero.proto'),
      url: '0.0.0.0:50051',
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'ecbProvider',
      // TODO verify proto project location
      protoPath: join(__dirname, '../proto/ecb-provider.proto'),
      url: '0.0.0.0:50052',
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'currencyConverter',
      // TODO verify proto project location
      protoPath: join(__dirname, '../proto/currency-converter.proto'),
      url: '0.0.0.0:50053',
    },
  });

  await app.startAllMicroservices();
  // TODO add swagger
  // const config = new DocumentBuilder()
  //   .setTitle('GRPC example')
  //   .setDescription('The GRPC API description')
  //   .setVersion('1.0')
  //   .addTag('grpc')
  //   .build();

  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document);

  console.log(app.getMicroservices())

  await app.listen(3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
