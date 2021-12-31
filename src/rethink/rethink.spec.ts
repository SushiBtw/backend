import { Test, TestingModule } from '@nestjs/testing';
import { Rethink } from './rethink';

describe('Rethink', () => {
  let provider: Rethink;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Rethink],
    }).compile();

    provider = module.get<Rethink>(Rethink);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
