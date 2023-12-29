import { InMemoryExerciseRepository } from '../../../../../test/repositories/in-memory-exercise-repository';
import { FetchCoachExercisesUseCase } from './fetch-coach-exercises';
import { makeExercise } from '../../../../../test/factories/make-exercise';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryExerciseRepository: InMemoryExerciseRepository;
let sut: FetchCoachExercisesUseCase;

describe('Fetch coach exercises', () => {
  beforeEach(() => {
    inMemoryExerciseRepository = new InMemoryExerciseRepository();
    sut = new FetchCoachExercisesUseCase(inMemoryExerciseRepository);
  });

  it('Fetch all coach exercises by coachId', async () => {
    await inMemoryExerciseRepository.create(
      makeExercise({
        coachId: new UniqueEntityID('coach-1'),
      }),
    );

    await inMemoryExerciseRepository.create(
      makeExercise({
        coachId: new UniqueEntityID('coach-1'),
      }),
    );

    const result = await sut.execute({
      coachId: 'coach-1',
    });

    expect(result.value.exercises).toHaveLength(2);
    expect(result.value.exercises).toEqual([
      expect.objectContaining({ coachId: new UniqueEntityID('coach-1') }),
      expect.objectContaining({ coachId: new UniqueEntityID('coach-1') }),
    ]);
  });
});
