import { CreateManyExercisesUseCase } from './create-many-exercises';
import { InMemoryExerciseRepository } from '../../../../../test/repositories/in-memory-exercise-repository';
import { makeExercise } from '../../../../../test/factories/make-exercise';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryExerciseRepository: InMemoryExerciseRepository;
let sut: CreateManyExercisesUseCase;

describe('Create many exercises', () => {
  beforeEach(() => {
    inMemoryExerciseRepository = new InMemoryExerciseRepository();
    sut = new CreateManyExercisesUseCase(inMemoryExerciseRepository);
  });

  it('should be able to create new exercises', async () => {
    const exercise1 = makeExercise();
    const exercise2 = makeExercise();

    const result = await sut.execute({
      exercises: [
        {
          title: exercise1.title,
          description: exercise1.description,
          category: exercise1.category,
          athleteId: 'athlete-1',
          dayOfWeek: exercise1.dayOfWeek,
        },
        {
          title: exercise2.title,
          description: exercise2.description,
          category: exercise2.category,
          normalUserId: 'normal-user-1',
          dayOfWeek: exercise2.dayOfWeek,
        },
      ],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryExerciseRepository.items).toHaveLength(2);
    expect(
      inMemoryExerciseRepository.items[0].athleteId ===
        new UniqueEntityID('athlete-1'),
    );
    expect(
      inMemoryExerciseRepository.items[1].normalUserId ===
        new UniqueEntityID('normal-user-1'),
    );
  });
});
