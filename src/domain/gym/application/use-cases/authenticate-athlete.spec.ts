import { makeAthlete } from '../../../../../test/factories/make-athlete';
import { FakeEncrypter } from '../../../../../test/cryptography/fake-encrypter';
import { FakeHasher } from '../../../../../test/cryptography/fake-hasher';
import { AuthenticateAthleteUseCase } from './authenticate-athlete';
import { InMemoryAthleteRepository } from '../../../../../test/repositories/in-memory-athlete-repository';

let inMemoryAthleteRepository: InMemoryAthleteRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateAthleteUseCase;

describe('Authenticate Athlete', () => {
  beforeEach(() => {
    inMemoryAthleteRepository = new InMemoryAthleteRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateAthleteUseCase(
      inMemoryAthleteRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });

  it('should be able to authenticate a athlete', async () => {
    const athlete = makeAthlete({
      email: 'test@example.com',
      password: await fakeHasher.hash('123456'),
    });

    inMemoryAthleteRepository.create(athlete);

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
