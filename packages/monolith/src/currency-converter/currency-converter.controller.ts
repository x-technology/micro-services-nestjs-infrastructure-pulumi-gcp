import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Controller, Get, Inject } from '@nestjs/common';
import { ClientGrpc, GrpcMethod } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { ConvertRequest, ConvertResponse, CurrencyConverter } from './proto/currency-converter';
import { GetRatesRequest, GetRatesResponse } from './proto/currency-provider';
import { EcbProvider } from './proto/ecb-provider';

@Controller('currency-converter')
export class CurrencyConverterController {
  // TODO make multiple
  private providerClient: EcbProvider;
  private currencyConvertClient: CurrencyConverter;
  private providerClients: EcbProvider[] = [];

  constructor(
    @Inject('ECBPROVIDER_PACKAGE') private readonly client: ClientGrpc,
    @Inject('CURRENCYCONVERTER_PACKAGE') private readonly convertClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.providerClient = this.client.getService<EcbProvider>('EcbProvider');
    this.currencyConvertClient = this.convertClient.getService<CurrencyConverter>('CurrencyConverter');

    this.providerClients.push(this.providerClient);
  }

  private getConversionRate(
    rates: { currency?: string, rate?: number }[], currency: string,
  ) {
    const rate = rates.find((r) => r.currency === currency);
    if (!rate) {
      throw new Error(`Currency ${currency} is not supported`);
    }
    return rate.rate;
  };

  @GrpcMethod('CurrencyConverter')
  async Convert(data: ConvertRequest, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<ConvertResponse> {
    const { sellAmount, buyCurrency, sellCurrency } = data;

    // TODO add an original crypto currency conversion task
    const aggregatedRates = await Promise.all(this.providerClients.map((client) => client.GetRates(GetRatesRequest.fromJSON({}))));

    const $provider1rates = aggregatedRates[0]; // this is done just for 1 provider
    const firstNumber = await firstValueFrom($provider1rates as unknown as Observable<GetRatesResponse>);
    const provider1 = firstNumber as unknown as GetRatesResponse;

    const rates = [
      ...provider1.rates,
      {
        rate: 1,
        currency: provider1.baseCurrency,
      },
    ];
    const conversionRate = this.getConversionRate(rates, buyCurrency) / this.getConversionRate(rates, sellCurrency);

    return ConvertResponse.fromJSON({
      conversionRate: Math.ceil(conversionRate * 100000) / 100000,
      buyAmount: Math.floor(sellAmount * conversionRate * 100) / 100,
      sellAmount,
      buyCurrency,
      sellCurrency,
    });
  }

  @Get('convert')
  async convert(): Promise<ConvertResponse> {
    // TODO fix type definitions
    const $rates = this.currencyConvertClient.Convert(ConvertRequest.fromJSON({
      sellAmount: 100,
      sellCurrency: 'USD',
      buyCurrency: 'GBP',
    }));

    const firstNumber = await firstValueFrom($rates as unknown as Observable<ConvertResponse>);
    const rates = firstNumber as unknown as ConvertResponse

    return rates
  }

  @Get('rates')
  async callGRPCclient(): Promise<GetRatesResponse> {
    // TODO fix type definitions
    const $rates = this.providerClient.GetRates({});
    const firstNumber = await firstValueFrom($rates as unknown as Observable<GetRatesResponse>);
    const rates = firstNumber as unknown as GetRatesResponse

    return rates
  }

  @Get()
  async getHello(): Promise<string> {
    return 'hello from currency-converter'
  }
}
