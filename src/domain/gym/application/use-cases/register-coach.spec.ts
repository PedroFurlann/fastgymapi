import { InMemoryCoachRepository } from '../../../../../test/repositories/in-memory-coach-repository';
import { RegisterCoachUseCase } from './register-coach';
import { FakeHasher } from '../../../../../test/cryptography/fake-hasher';

let inMemoryCoachRepository: InMemoryCoachRepository;
let fakeHasher: FakeHasher;
let sut: RegisterCoachUseCase;

describe('Register Coach', () => {
  beforeEach(() => {
    inMemoryCoachRepository = new InMemoryCoachRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterCoachUseCase(inMemoryCoachRepository, fakeHasher);
  });

  it('should be able to register a coach', async () => {
    const result = await sut.execute({
      name: 'Test coach',
      email: 'example@email.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      coach: inMemoryCoachRepository.items[0],
    });
  });

  it('should hash coach password upon registration', async () => {
    const result = await sut.execute({
      name: 'Test coach',
      email: 'example@email.com',
      password: '123456',
    });

    const hashedPassword = await fakeHasher.hash('123456');

    expect(result.isRight()).toBe(true);
    expect(inMemoryCoachRepository.items[0].password).toEqual(hashedPassword);
  });
});
