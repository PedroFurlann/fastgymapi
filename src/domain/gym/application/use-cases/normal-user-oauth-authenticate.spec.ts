import { makeNormalUser } from '../../../../../test/factories/make-normal-user';
import { FakeEncrypter } from '../../../../../test/cryptography/fake-encrypter';
import { FakeHasher } from '../../../../../test/cryptography/fake-hasher';
import { InMemoryNormalUserRepository } from '../../../../../test/repositories/in-memory-normal-user-repository';
import { NormalUserOAuthAuthenticate } from './normal-user-oauth-authenticate';

let inMemoryNormalUserRepository: InMemoryNormalUserRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: NormalUserOAuthAuthenticate;

describe('Authenticate Normal User', () => {
  beforeEach(() => {
    inMemoryNormalUserRepository = new InMemoryNormalUserRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new NormalUserOAuthAuthenticate(
      inMemoryNormalUserRepository,
      fakeHasher,
      fakeHasher,
      fakeEncrypter,
    );
  });

  it('should be able to create and authenticate a normal user', async () => {
    const result = await sut.execute({
      email: 'test@example.com',
      avatarUrl: 'teste-1',
      name: 'Pedro',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryNormalUserRepository.items[0].avatarUrl).toEqual('teste-1');
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });

  it('should be able to authenticate a normal user', async () => {
    const normalUser = makeNormalUser({
      email: 'test@example.com',
      avatarUrl: 'test-1',
      name: 'Pedro',
    });

    inMemoryNormalUserRepository.create(normalUser);

    const result = await sut.execute({
      email: 'test@example.com',
      avatarUrl: 'test-2',
      name: 'Pedro02',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryNormalUserRepository.items[0].avatarUrl).toEqual('test-2');
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });
});
