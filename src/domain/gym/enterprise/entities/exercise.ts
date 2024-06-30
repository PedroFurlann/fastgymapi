import { Entity } from '../../../../core/entities/entity';
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';
import { Optional } from '../../../../core/types/optional';

export interface ExerciseProps {
  title: string;
  description: string;
  category: string;
  mediaUrl?: string | null;
  previewUrl?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
  coachId?: UniqueEntityID | null;
  normalUserId?: UniqueEntityID | null;
  workoutId?: UniqueEntityID | null;
  athleteId?: UniqueEntityID | null;
  series?: number[] | null;
  repetitions?: number[] | null;
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
    this.touch();
  }

  get category() {
    return this.props.category;
  }

  set category(newCategory: string) {
    this.props.category = newCategory;
    this.touch();
  }

  get series() {
    return this.props.series;
  }

  set series(newSeries: number[]) {
    this.props.series = newSeries;
    this.touch();
  }

  get repetitions() {
    return this.props.repetitions;
  }

  set repetitions(newRepetitions: number[]) {
    this.props.repetitions = newRepetitions;
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

  get workoutId() {
    return this.props.workoutId;
  }

  set workoutId(workoutId: UniqueEntityID) {
    this.props.workoutId = workoutId;
    this.touch();
  }

  get normalUserId() {
    return this.props.normalUserId;
  }

  set normalUserId(normalUserId: UniqueEntityID) {
    this.props.normalUserId = normalUserId;
    this.touch();
  }

  get mediaUrl() {
    return this.props.mediaUrl;
  }

  set mediaUrl(newMediaUrl: string) {
    this.props.mediaUrl = newMediaUrl;
    this.touch();
  }

  get previewUrl() {
    return this.props.previewUrl;
  }

  set previewUrl(newPreviewUrl: string) {
    this.props.previewUrl = newPreviewUrl;
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
