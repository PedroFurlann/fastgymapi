import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/prisma/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { CoachFactory } from 'test/factories/make-coach';

describe('Register (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let coachFactory: CoachFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CoachFactory],
    }).compile();

    coachFactory = moduleRef.get(CoachFactory);
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);
    app = moduleRef.createNestApplication();

    await app.init();
  });

  test('[POST] /register/coach', async () => {
    const response = await request(app.getHttpServer())
      .post('/register/coach')
      .send({
        name: 'coach01',
        email: 'test1@example.com',
        password: '123456',
      });

    const coachOnDatabase = await prisma.coach.findUnique({
      where: {
        email: 'test1@example.com',
      },
    });

    expect(response.statusCode).toBe(201);
    expect(coachOnDatabase).toBeTruthy();
  });

  test('[POST] /register/athlete', async () => {
    const user = await coachFactory.makePrismaCoach();

    const accessToken = jwt.sign({ sub: user.id.toString(), isAthlete: false });

    const response = await request(app.getHttpServer())
      .post('/register/athlete')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'athlete01',
        email: 'test2@example.com',
        password: '123456',
      });

    const athleteOnDatabase = await prisma.athlete.findUnique({
      where: {
        email: 'test2@example.com',
      },
    });

    expect(response.statusCode).toBe(201);
    expect(athleteOnDatabase).toBeTruthy();
  });
});
