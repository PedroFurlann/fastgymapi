import { makeHistory } from '../../../../../test/factories/make-history';
import { InMemoryHistoryRepository } from '../../../../../test/repositories/in-memory-history-repository';
import { DeleteNormalUserHistoryUseCase } from './delete-normal-user-history';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryHistoryRepository: InMemoryHistoryRepository;
let sut: DeleteNormalUserHistoryUseCase;

describe('Delete normal user history', () => {
  beforeEach(() => {
    inMemoryHistoryRepository = new InMemoryHistoryRepository();
    sut = new DeleteNormalUserHistoryUseCase(inMemoryHistoryRepository);
  });

  it('should be able to delete normal user history', async () => {
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
