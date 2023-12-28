import { Athlete } from '../../enterprise/entities/athlete';

export abstract class AthleteRepository {
  abstract create(athlete: Athlete): Promise<void>;
  abstract findById(id: string): Promise<Athlete | null>;
  abstract update(athlete: Athlete): Promise<void>;
  abstract delete(athleteId: string): Promise<void>;
  abstract findManyByCoachId(coachId: string): Promise<Athlete[] | null>;
  abstract findByEmail(email: string): Promise<Athlete | null>;
}
