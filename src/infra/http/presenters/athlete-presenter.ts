import { Athlete } from '@/domain/gym/enterprise/entities/athlete';

export class AthletePresenter {
  static toHTTP(athlete: Athlete) {
    return {
      id: athlete.id.toString(),
      name: athlete.name,
      email: athlete.email,
      avatarUrl: athlete.avatarUrl,
      createdAt: athlete.createdAt,
      updatedAt: athlete.updatedAt,
    };
  }
}
