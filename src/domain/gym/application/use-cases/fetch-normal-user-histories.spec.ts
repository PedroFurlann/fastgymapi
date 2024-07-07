import { InMemoryHistoryRepository } from '../../../../../test/repositories/in-memory-history-repository';
import { FetchNormalUserHistoriesUseCase } from './fetch-normal-user-histories';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeHistory } from '../../../../../test/factories/make-history';

let inMemoryHistoryRepository: InMemoryHistoryRepository;
let sut: FetchNormalUserHistoriesUseCase;

describe('Fetch normal user histories', () => {
  beforeEach(() => {
    inMemoryHistoryRepository = new InMemoryHistoryRepository();
    sut = new FetchNormalUserHistoriesUseCase(inMemoryHistoryRepository);
  });

  it('Fetch all normal user histories by normalUserId', async () => {
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

    expect(result.value.histories).toHaveLength(2);
    expect(result.value.histories).toEqual([
      expect.objectContaining({
        normalUserId: new UniqueEntityID('normal-user-1'),
      }),
      expect.objectContaining({
        normalUserId: new UniqueEntityID('normal-user-1'),
      }),
    ]);
  });
});
