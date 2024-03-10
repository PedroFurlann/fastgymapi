import { InMemoryNormalUserRepository } from '../../../../../test/repositories/in-memory-normal-user-repository';
import { RegisterNormalUserUseCase } from './register-normal-user';
import { FakeHasher } from '../../../../../test/cryptography/fake-hasher';

let inMemoryNormalUserRepository: InMemoryNormalUserRepository;
let fakeHasher: FakeHasher;
let sut: RegisterNormalUserUseCase;

describe('Register Normal User', () => {
  beforeEach(() => {
    inMemoryNormalUserRepository = new InMemoryNormalUserRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterNormalUserUseCase(
      inMemoryNormalUserRepository,
      fakeHasher,
    );
  });

  it('should be able to register a normal user', async () => {
    const result = await sut.execute({
      name: 'Test Normal user',
      email: 'example@email.com',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      normalUser: inMemoryNormalUserRepository.items[0],
    });
  });
});
