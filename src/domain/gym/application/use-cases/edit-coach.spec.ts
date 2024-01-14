import { FakeHasher } from '../../../../../test/cryptography/fake-hasher';
import { makeCoach } from '../../../../../test/factories/make-coach';
import { InMemoryCoachRepository } from '../../../../../test/repositories/in-memory-coach-repository';
import { EditCoachUseCase } from './edit-coach';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryCoachRepository: InMemoryCoachRepository;
let fakeHasher: FakeHasher;
let sut: EditCoachUseCase;

describe('Edit Coach', () => {
  beforeEach(() => {
    inMemoryCoachRepository = new InMemoryCoachRepository();
    fakeHasher = new FakeHasher();
    sut = new EditCoachUseCase(inMemoryCoachRepository, fakeHasher);
  });

  it('should be able to edit a coach', async () => {
    const coach = makeCoach(
      {
        name: 'John',
        email: 'john@example.com',
      },
      new UniqueEntityID('coach-1'),
    );

    await inMemoryCoachRepository.create(coach);

    await sut.execute({
      coachId: coach.id.toString(),
      name: 'Pedro',
      password: '11234',
    });

    expect(inMemoryCoachRepository.items[0]).toMatchObject({
      name: 'Pedro',
      password: '11234-hashed',
    });
  });
});
