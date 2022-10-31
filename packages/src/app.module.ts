import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HeroModule } from './hero/hero.module';
import { EcbProviderModule } from './ecb-provider/ecb-provider.module';
import { CurrencyConverterModule } from './currency-converter/currency-converter.module';

@Module({
  imports: [HeroModule, EcbProviderModule, CurrencyConverterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
