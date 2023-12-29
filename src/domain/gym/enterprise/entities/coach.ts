import { Entity } from '../../../../core/entities/entity';
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';

export interface CoachProps {
  name: string;
  email: string;
  password: string;
  avatarUrl?: string | null;
  updatedAt?: Date | null;
}

export class Coach extends Entity<CoachProps> {
  get name() {
    return this.props.name;
  }

  set name(newName: string) {
    this.props.name = newName;
    this.touch();
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  set password(newPassword: string) {
    this.props.password = newPassword;
    this.touch();
  }

  get avatarUrl() {
    return this.props.avatarUrl;
  }

  set avatarUrl(newAvatarUrl: string) {
    this.props.avatarUrl = newAvatarUrl;
    this.touch();
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: CoachProps, id?: UniqueEntityID) {
    const coach = new Coach(props, id);

    return coach;
  }
}
