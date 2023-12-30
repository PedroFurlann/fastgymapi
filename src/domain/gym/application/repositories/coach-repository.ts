import { Coach } from '../../enterprise/entities/coach';

export abstract class CoachRepository {
  abstract create(coach: Coach): Promise<void>;
  abstract findByEmail(email: string): Promise<Coach | null>;
  abstract findById(coachId: string): Promise<Coach | null>;
  abstract update(coach: Coach): Promise<void>;
  abstract delete(coachId: string): Promise<void>;
}
