import { makeCoach } from '../../../../../test/factories/make-coach';
import { FakeEncrypter } from '../../../../../test/cryptography/fake-encrypter';
import { FakeHasher } from '../../../../../test/cryptography/fake-hasher';
import { AuthenticateCoachUseCase } from './authenticate-coach';
import { InMemoryCoachRepository } from '../../../../../test/repositories/in-memory-coach-repository';

let inMemoryCoachRepository: InMemoryCoachRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateCoachUseCase;

describe('Authenticate Coach', () => {
  beforeEach(() => {
    inMemoryCoachRepository = new InMemoryCoachRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateCoachUseCase(
      inMemoryCoachRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });

  it('should be able to authenticate a coach', async () => {
    const coach = makeCoach({
      email: 'test@example.com',
      password: await fakeHasher.hash('123456'),
    });

    inMemoryCoachRepository.create(coach);

    const result = await sut.execute({
      email: 'test@example.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });
});
