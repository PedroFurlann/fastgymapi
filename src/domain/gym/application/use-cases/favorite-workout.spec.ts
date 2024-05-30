import { FavoriteWorkoutUseCase } from './favorite-workout';
import { InMemoryWorkoutRepository } from '../../../../../test/repositories/in-memory-workout-repository';
import { makeWorkout } from '../../../../../test/factories/make-workout';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

let inMemoryWorkoutRepository: InMemoryWorkoutRepository;
let sut: FavoriteWorkoutUseCase;

describe('Favorite Workout', () => {
  beforeEach(() => {
    inMemoryWorkoutRepository = new InMemoryWorkoutRepository();
    sut = new FavoriteWorkoutUseCase(inMemoryWorkoutRepository);
  });

  it('should be able to favorite a workout', async () => {
    const workout = makeWorkout({
      normalUserId: new UniqueEntityID('normal-user-1'),
    });

    await inMemoryWorkoutRepository.create(workout);

    const result = await sut.execute({
      normalUserId: 'normal-user-1',
      favorite: true,
      workoutId: workout.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryWorkoutRepository.items[0].favorite).toEqual(true);
  });

  it('should not be able to favorite a workout from another normal user', async () => {
    const workout = makeWorkout(
      {
        normalUserId: new UniqueEntityID('normal-user-1'),
      },
      new UniqueEntityID('workout-1'),
    );

    await inMemoryWorkoutRepository.create(workout);

    const result = await sut.execute({
      normalUserId: 'normal-user-2',
      workoutId: workout.id.toString(),
      favorite: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
