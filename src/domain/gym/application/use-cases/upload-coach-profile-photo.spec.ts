import { FakeUploader } from '../../../../../test/storage/fake-uploader';
import { InMemoryCoachRepository } from '../../../../../test/repositories/in-memory-coach-repository';
import { UploadCoachProfilePhoto } from './upload-coach-profile-photo';
import { makeCoach } from '../../../../../test/factories/make-coach';
import { InvalidFileType } from './errors/invalid-file-type-error';

let inMemoryCoachRepository: InMemoryCoachRepository;
let fakeUploader: FakeUploader;
let sut: UploadCoachProfilePhoto;

describe('Upload and create coach profile photo', () => {
  beforeEach(() => {
    inMemoryCoachRepository = new InMemoryCoachRepository();
    fakeUploader = new FakeUploader();
    sut = new UploadCoachProfilePhoto(inMemoryCoachRepository, fakeUploader);
  });

  it('should be able to upload and create an coach', async () => {
    const coach = makeCoach();

    await inMemoryCoachRepository.create(coach);

    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
      entityId: coach.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryCoachRepository.items[0].avatarUrl).toEqual(
      expect.any(String),
    );
    expect(fakeUploader.uploads).toHaveLength(1);
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    );
  });

  it('should not be able to upload an coach profile photo with invalid file type', async () => {
    const coach = makeCoach();

    await inMemoryCoachRepository.create(coach);

    const result = await sut.execute({
      fileName: 'profile.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
      entityId: coach.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidFileType);
  });
});
