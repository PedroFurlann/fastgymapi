import { InMemoryHistoryRepository } from '../../../../../test/repositories/in-memory-history-repository';
import { FetchNormalUserHistoryUseCase } from './fetch-normal-user-history';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeHistory } from '../../../../../test/factories/make-history';

let inMemoryHistoryRepository: InMemoryHistoryRepository;
let sut: FetchNormalUserHistoryUseCase;

describe('Fetch normal user history', () => {
  beforeEach(() => {
    inMemoryHistoryRepository = new InMemoryHistoryRepository();
    sut = new FetchNormalUserHistoryUseCase(inMemoryHistoryRepository);
  });

  it('Fetch all normal user history by normalUserId', async () => {
    await inMemoryHistoryRepository.create(
      makeHistory({
        normalUserId: new UniqueEntityID('normal-user-1'),
      }),
    );

    await inMemoryHistoryRepository.create(
      makeHistory({
        normalUserId: new UniqueEntityID('normal-user-1'),
      }),
    );

    const result = await sut.execute({
      normalUserId: 'normal-user-1',
    });

    expect(result.value.history).toHaveLength(2);
    expect(result.value.history).toEqual([
      expect.objectContaining({
        normalUserId: new UniqueEntityID('normal-user-1'),
      }),
      expect.objectContaining({
        normalUserId: new UniqueEntityID('normal-user-1'),
      }),
    ]);
  });
});
