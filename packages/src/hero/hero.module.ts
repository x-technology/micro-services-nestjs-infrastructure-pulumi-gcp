import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { HeroController } from './hero.controller';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {join} from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'HERO_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'hero',
          protoPath: join(__dirname, '../../proto/hero.proto'),
          // TODO make PORT configurable
          url: '0.0.0.0:50051',
        },
      },
    ]),
  ],
  controllers: [HeroController],
})
export class HeroModule {}
