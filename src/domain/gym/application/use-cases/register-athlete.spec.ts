import { InMemoryAthleteRepository } from '../../../../../test/repositories/in-memory-athlete-repository';
import { RegisterAthleteUseCase } from './register-athlete';
import { FakeHasher } from '../../../../../test/cryptography/fake-hasher';
import { makeCoach } from '../../../../../test/factories/make-coach';

let inMemoryAthleteRepository: InMemoryAthleteRepository;
let fakeHasher: FakeHasher;
let sut: RegisterAthleteUseCase;

describe('Register Athlete', () => {
  beforeEach(() => {
    inMemoryAthleteRepository = new InMemoryAthleteRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterAthleteUseCase(inMemoryAthleteRepository, fakeHasher);
  });

  it('should be able to register a athlete', async () => {
    const coach = makeCoach();

    const result = await sut.execute({
      name: 'Test athlete',
      email: 'example@email.com',
      password: '123456',
      coachId: coach.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      athlete: inMemoryAthleteRepository.items[0],
    });
    expect(inMemoryAthleteRepository.items[0].coachId).toEqual(coach.id);
  });

  it('should hash athlete password upon registration', async () => {
    const coach = makeCoach();

    const result = await sut.execute({
      name: 'Test athlete',
      email: 'example@email.com',
      password: '123456',
      coachId: coach.id.toString(),
    });

    const hashedPassword = await fakeHasher.hash('123456');

    expect(result.isRight()).toBe(true);
    expect(inMemoryAthleteRepository.items[0].password).toEqual(hashedPassword);
    expect(inMemoryAthleteRepository.items[0].coachId).toEqual(coach.id);
  });
});
