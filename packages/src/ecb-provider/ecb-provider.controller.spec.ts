import { Test, TestingModule } from '@nestjs/testing';
import { EcbProviderController } from './ecb-provider.controller';

describe('EcbProviderController', () => {
  let controller: EcbProviderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EcbProviderController],
    }).compile();

    controller = module.get<EcbProviderController>(EcbProviderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
