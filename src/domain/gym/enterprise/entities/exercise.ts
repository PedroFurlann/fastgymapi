import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Optional } from 'src/core/types/optional';

export interface ExerciseProps {
  title: string;
  description: string;
  videoUrl?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
  coachId: UniqueEntityID;
  athleteId?: UniqueEntityID | null;
}

export class Exercise extends Entity<ExerciseProps> {
  get title() {
    return this.props.title;
  }

  set title(newTitle: string) {
    this.props.title = newTitle;
    this.touch();
  }

  get description() {
    return this.props.description;
  }

  set description(newDescription: string) {
    this.props.description = newDescription;
  }

  get athleteId() {
    return this.props.athleteId;
  }

  get videoUrl() {
    return this.props.videoUrl;
  }

  set videoUrl(newvideoUrl: string) {
    this.props.videoUrl = newvideoUrl;
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
    props: Optional<ExerciseProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const exercise = new Exercise(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return exercise;
  }
}
