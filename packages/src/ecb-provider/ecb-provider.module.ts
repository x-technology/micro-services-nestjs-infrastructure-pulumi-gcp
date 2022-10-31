import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';
import {join} from 'path';
import { EcbProviderController } from './ecb-provider.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ECBPROVIDER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'ecbProvider',
          protoPath: join(__dirname, '../../proto/ecb-provider.proto'),
          // TODO make PORT configurable
          url: '0.0.0.0:50052',
        },
      },
    ]),
  ],
  controllers: [EcbProviderController],
})
export class EcbProviderModule {}
