import { makeNormalUser } from '../../../../../test/factories/make-normal-user';
import { FakeEncrypter } from '../../../../../test/cryptography/fake-encrypter';
import { FakeHasher } from '../../../../../test/cryptography/fake-hasher';
import { AuthenticateNormalUserUseCase } from './authenticate-normal-user';
import { InMemoryNormalUserRepository } from '../../../../../test/repositories/in-memory-normal-user-repository';

let inMemoryNormalUserRepository: InMemoryNormalUserRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateNormalUserUseCase;

describe('Authenticate NormalUser', () => {
  beforeEach(() => {
    inMemoryNormalUserRepository = new InMemoryNormalUserRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateNormalUserUseCase(
      inMemoryNormalUserRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });

  it('should be able to authenticate a normaluser', async () => {
    const normalUser = makeNormalUser({
      email: 'test@example.com',
    });

    inMemoryNormalUserRepository.create(normalUser);

    const result = await sut.execute({
      email: 'test@example.com',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });
});
