import { Entity } from '../../../../core/entities/entity';
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';
import { Optional } from '../../../../core/types/optional';

export interface WorkoutProps {
  title: string;
  createdAt: Date;
  favorite?: boolean;
  updatedAt?: Date | null;
  coachId?: UniqueEntityID | null;
  normalUserId?: UniqueEntityID | null;
  athleteId?: UniqueEntityID | null;
}

export class Workout extends Entity<WorkoutProps> {
  get title() {
    return this.props.title;
  }

  set title(newTitle: string) {
    this.props.title = newTitle;
    this.touch();
  }

  get favorite() {
    return this.props.favorite;
  }

  set favorite(favorite: boolean) {
    this.props.favorite = favorite;
    this.touch();
  }

  get coachId() {
    return this.props.coachId;
  }

  set coachId(coachId: UniqueEntityID) {
    this.props.coachId = coachId;
    this.touch();
  }

  get athleteId() {
    return this.props.athleteId;
  }

  set athleteId(athleteId: UniqueEntityID) {
    this.props.athleteId = athleteId;
    this.touch();
  }

  get normalUserId() {
    return this.props.normalUserId;
  }

  set normalUserId(normalUserId: UniqueEntityID) {
    this.props.normalUserId = normalUserId;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<WorkoutProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const workout = new Workout(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return workout;
  }
}
