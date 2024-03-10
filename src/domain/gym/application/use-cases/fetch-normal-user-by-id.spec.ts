import { InMemoryNormalUserRepository } from '../../../../../test/repositories/in-memory-normal-user-repository';
import { makeNormalUser } from '../../../../../test/factories/make-normal-user';
import { FetchNormalUserByIdUseCase } from './fetch-normal-user-by-id';

let inMemoryNormalUserRepository: InMemoryNormalUserRepository;
let sut: FetchNormalUserByIdUseCase;

describe('Fetch normal user', () => {
  beforeEach(() => {
    inMemoryNormalUserRepository = new InMemoryNormalUserRepository();
    sut = new FetchNormalUserByIdUseCase(inMemoryNormalUserRepository);
  });

  it('Fetch normal user by id', async () => {
    const normalUser = makeNormalUser();

    await inMemoryNormalUserRepository.create(normalUser);

    const result = await sut.execute({
      normalUserId: normalUser.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value.normalUser).toEqual(
      expect.objectContaining({
        name: inMemoryNormalUserRepository.items[0].name,
      }),
    );
  });
});
