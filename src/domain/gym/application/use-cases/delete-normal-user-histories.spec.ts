import { makeHistory } from '../../../../../test/factories/make-history';
import { InMemoryHistoryRepository } from '../../../../../test/repositories/in-memory-history-repository';
import { DeleteNormalUserHistoriesUseCase } from './delete-normal-user-histories';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryHistoryRepository: InMemoryHistoryRepository;
let sut: DeleteNormalUserHistoriesUseCase;

describe('Delete normal user histories', () => {
  beforeEach(() => {
    inMemoryHistoryRepository = new InMemoryHistoryRepository();
    sut = new DeleteNormalUserHistoriesUseCase(inMemoryHistoryRepository);
  });

  it('should be able to delete normal user histories', async () => {
    const history = makeHistory({
      normalUserId: new UniqueEntityID('normal-user-1'),
    });

    await inMemoryHistoryRepository.create(history);

    await sut.execute({
      normalUserId: 'normal-user-1',
    });

    expect(inMemoryHistoryRepository.items).toHaveLength(0);
  });
});
