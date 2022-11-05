import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CurrencyConverterController } from './currency-converter.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CURRENCYCONVERTER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'currencyConverter',
          // TODO verify proto project location
          protoPath: join(__dirname, '../../proto/currency-converter.proto'),
          // TODO make PORT configurable
          url: '0.0.0.0:50053',
        },
      },
    ]),
    // TODO make dynamic PROVIDER_SERVICES=localhost:50052,localhost:50053
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
  controllers: [CurrencyConverterController]
})
export class CurrencyConverterModule {}
