import { makeNormalUser } from '../../../../../test/factories/make-normal-user';
import { InMemoryNormalUserRepository } from '../../../../../test/repositories/in-memory-normal-user-repository';
import { DeleteNormalUserUseCase } from './delete-normal-user';

let inMemoryNormalUserRepository: InMemoryNormalUserRepository;
let sut: DeleteNormalUserUseCase;

describe('Delete Normal User', () => {
  beforeEach(() => {
    inMemoryNormalUserRepository = new InMemoryNormalUserRepository();
    sut = new DeleteNormalUserUseCase(inMemoryNormalUserRepository);
  });

  it('should be able to delete a normal user', async () => {
    const normalUser = makeNormalUser();

    await inMemoryNormalUserRepository.create(normalUser);

    await sut.execute({
      normalUserId: normalUser.id.toString(),
    });

    expect(inMemoryNormalUserRepository.items).toHaveLength(0);
  });
});
