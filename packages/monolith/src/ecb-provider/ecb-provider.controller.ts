import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Controller, Get, Inject } from '@nestjs/common';
import { ClientGrpc, GrpcMethod } from '@nestjs/microservices';
import { XMLParser } from 'fast-xml-parser';
import fetch from 'node-fetch';
import { firstValueFrom, Observable } from 'rxjs';
import { GetRatesRequest, GetRatesResponse, GetRatesResponse_ExchangeRate } from './proto/currency-provider';
import { EcbProvider } from './proto/ecb-provider';

@Controller('ecb-provider')
export class EcbProviderController {
  private RATE_URL = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';
  private BASE_CURRENCY = 'EUR';
  private ecpProviderClient: EcbProvider;

  constructor(
    @Inject('ECBPROVIDER_PACKAGE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.ecpProviderClient = this.client.getService<EcbProvider>('EcbProvider');
  }

  async getEcbRates(): Promise<{ currency: string, rate: number }[]> {
    const response = await fetch(this.RATE_URL);
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
    });
    const {
      'gesmes:Envelope': {
        Cube: {
          Cube: { Cube },
        },
      },
    } = parser.parse(await response.text());

    return Cube;
  }

  @GrpcMethod('EcbProvider')
  async getRates(data: GetRatesRequest, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<GetRatesResponse> {
    const rates = (await this.getEcbRates())
      .map(({ currency, rate }) => GetRatesResponse_ExchangeRate.fromJSON({
        currency, rate,
      }));

    return GetRatesResponse.fromJSON({
      rates,
      baseCurrency: this.BASE_CURRENCY,
    });
  }

  @Get('grpc')
  async callGRPCclient(): Promise<GetRatesResponse> {
    const $rates = this.ecpProviderClient.GetRates({});
    const firstNumber = await firstValueFrom($rates as unknown as Observable<GetRatesResponse>);
    const rates = firstNumber as unknown as GetRatesResponse

    return rates
  }

  @Get()
  async getHello(): Promise<string> {
    const rates = await this.getEcbRates()
    console.log(rates)
    return 'hello from ecb'
  }
}
