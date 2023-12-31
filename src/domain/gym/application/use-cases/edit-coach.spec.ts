import { makeCoach } from '../../../../../test/factories/make-coach';
import { InMemoryCoachRepository } from '../../../../../test/repositories/in-memory-coach-repository';
import { EditCoachUseCase } from './edit-coach';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryCoachRepository: InMemoryCoachRepository;
let sut: EditCoachUseCase;

describe('Edit Coach', () => {
  beforeEach(() => {
    inMemoryCoachRepository = new InMemoryCoachRepository();
    sut = new EditCoachUseCase(inMemoryCoachRepository);
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

    const newCoach = makeCoach(
      {
        name: 'Pedro',
        email: 'email@example.com',
      },
      coach.id,
    );

    await sut.execute({
      coachId: coach.id.toString(),
      coach: newCoach,
    });

    expect(inMemoryCoachRepository.items[0]).toMatchObject({
      name: 'Pedro',
      email: 'email@example.com',
    });
  });
});
