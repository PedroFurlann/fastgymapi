import { Optional } from '@/core/types/optional';
import { Entity } from '../../../../core/entities/entity';
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';

export interface NormalUserProps {
  name: string;
  email: string;
  password?: string;
  avatarUrl?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
  recoveryPasswordCode?: string | null;
  recoveryPasswordCodeExpiresIn?: Date | null;
}

export class NormalUser extends Entity<NormalUserProps> {
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

  get recoveryPasswordCode() {
    return this.props.recoveryPasswordCode;
  }

  set recoveryPasswordCode(newRecoveryPasswordCode: string) {
    this.props.recoveryPasswordCode = newRecoveryPasswordCode;
    this.touch();
  }

  get recoveryPasswordCodeExpiresIn() {
    return this.props.recoveryPasswordCodeExpiresIn;
  }

  set recoveryPasswordCodeExpiresIn(newRecoveryPasswordCodeExpiresIn: Date) {
    this.props.recoveryPasswordCodeExpiresIn = newRecoveryPasswordCodeExpiresIn;
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
    props: Optional<NormalUserProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const normalUser = new NormalUser(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return normalUser;
  }
}
