import { InMemoryWorkoutRepository } from '../../../../../test/repositories/in-memory-workout-repository';
import { FetchNormalUserWorkoutsUseCase } from './fetch-normal-user-workouts';
import { makeWorkout } from '../../../../../test/factories/make-workout';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryWorkoutRepository: InMemoryWorkoutRepository;
let sut: FetchNormalUserWorkoutsUseCase;

describe('Fetch normal user workouts', () => {
  beforeEach(() => {
    inMemoryWorkoutRepository = new InMemoryWorkoutRepository();
    sut = new FetchNormalUserWorkoutsUseCase(inMemoryWorkoutRepository);
  });

  it('Fetch all normal user workouts by normalUserId', async () => {
    await inMemoryWorkoutRepository.create(
      makeWorkout({
        normalUserId: new UniqueEntityID('normal-user-1'),
      }),
    );

    await inMemoryWorkoutRepository.create(
      makeWorkout({
        normalUserId: new UniqueEntityID('normal-user-1'),
      }),
    );

    const result = await sut.execute({
      normalUserId: 'normal-user-1',
    });

    expect(result.value.workouts).toHaveLength(2);
    expect(result.value.workouts).toEqual([
      expect.objectContaining({
        normalUserId: new UniqueEntityID('normal-user-1'),
      }),
      expect.objectContaining({
        normalUserId: new UniqueEntityID('normal-user-1'),
      }),
    ]);
  });
});
