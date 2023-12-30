import { InMemoryExerciseRepository } from '../../../../../test/repositories/in-memory-exercise-repository';
import { makeExercise } from '../../../../../test/factories/make-exercise';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { FetchAthleteExercisesUseCase } from './fetch-athlete-exercises';

let inMemoryExerciseRepository: InMemoryExerciseRepository;
let sut: FetchAthleteExercisesUseCase;

describe('Fetch athlete exercises', () => {
  beforeEach(() => {
    inMemoryExerciseRepository = new InMemoryExerciseRepository();
    sut = new FetchAthleteExercisesUseCase(inMemoryExerciseRepository);
  });

  it('Fetch all athlete exercises by athleteId', async () => {
    await inMemoryExerciseRepository.create(
      makeExercise({
        athleteId: new UniqueEntityID('athlete-1'),
      }),
    );

    await inMemoryExerciseRepository.create(
      makeExercise({
        athleteId: new UniqueEntityID('athlete-1'),
      }),
    );

    const result = await sut.execute({
      athleteId: 'athlete-1',
    });

    expect(result.value.exercises).toHaveLength(2);
    expect(result.value.exercises).toEqual([
      expect.objectContaining({ athleteId: new UniqueEntityID('athlete-1') }),
      expect.objectContaining({ athleteId: new UniqueEntityID('athlete-1') }),
    ]);
  });
});
