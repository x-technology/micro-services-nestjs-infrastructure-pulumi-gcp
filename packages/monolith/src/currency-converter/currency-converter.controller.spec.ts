import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyConverterController } from './currency-converter.controller';

describe('CurrencyConverterController', () => {
  let controller: CurrencyConverterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrencyConverterController],
    }).compile();

    controller = module.get<CurrencyConverterController>(CurrencyConverterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
