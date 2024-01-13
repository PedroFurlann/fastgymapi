import { Coach } from '@/domain/gym/enterprise/entities/coach';

export class CoachPresenter {
  static toHTTP(coach: Coach) {
    return {
      id: coach.id.toString(),
      name: coach.name,
      email: coach.email,
      avatarUrl: coach.avatarUrl,
      createdAt: coach.createdAt,
      updatedAt: coach.updatedAt,
    };
  }
}
