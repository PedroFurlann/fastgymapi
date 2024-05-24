import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { DeleteAthleteProfilePhotoUseCase } from '@/domain/gym/application/use-cases/delete-athlete-profile-photo';
import { DeleteCoachProfilePhotoUseCase } from '@/domain/gym/application/use-cases/delete-coach-profile-photo';
import { DeleteNormalUserProfilePhotoUseCase } from '@/domain/gym/application/use-cases/delete-normal-user-profile-photo';
import { InvalidFileTypeError } from '@/domain/gym/application/use-cases/errors/invalid-file-type-error';
import { UploadAthleteProfilePhotoUseCase } from '@/domain/gym/application/use-cases/upload-athlete-profile-photo';
import { UploadCoachProfilePhotoUseCase } from '@/domain/gym/application/use-cases/upload-coach-profile-photo';
import { UploadNormalUserProfilePhotoUseCase } from '@/domain/gym/application/use-cases/upload-normal-user-profile-photo';
import { CoachRoleGuard } from '@/infra/auth/coach-role.guard';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { NormalUserRoleGuard } from '@/infra/auth/normal-user-role.guard';
import {
  BadRequestException,
  Controller,
  Delete,
  FileTypeValidator,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/storage')
export class StorageController {
  constructor(
    private readonly uploadCoachProfilePhotoUseCase: UploadCoachProfilePhotoUseCase,
    private readonly uploadAthleteProfilePhotoUseCase: UploadAthleteProfilePhotoUseCase,
    private readonly uploadNormalUserProfilePhotoUseCase: UploadNormalUserProfilePhotoUseCase,
    private readonly deleteCoachProfilePhotoUseCase: DeleteCoachProfilePhotoUseCase,
    private readonly deleteAthleteProfilePhotoUseCase: DeleteAthleteProfilePhotoUseCase,
    private readonly deleteNormalUserProfilePhotoUseCase: DeleteNormalUserProfilePhotoUseCase,
  ) {}

  @UseGuards(CoachRoleGuard)
  @Post('/coach/profile/photo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCoachProfilePhoto(
    @CurrentUser() user: UserPayload,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 5, // 5mb
          }),
          new FileTypeValidator({
            fileType: '.(png|jpg|jpeg|pdf)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const userId = user.sub;

    const result = await this.uploadCoachProfilePhotoUseCase.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
      entityId: userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case InvalidFileTypeError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }

  @Post('/athlete/profile/photo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAthleteProfilePhoto(
    @CurrentUser() user: UserPayload,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 5, // 5mb
          }),
          new FileTypeValidator({
            fileType: '.(png|jpg|jpeg|pdf)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const userId = user.sub;

    const result = await this.uploadAthleteProfilePhotoUseCase.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
      entityId: userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case InvalidFileTypeError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }

  @UseGuards(CoachRoleGuard)
  @Post('/coach/athlete/profile/photo/:athleteId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAthleteProfilePhotoFromCoach(
    @Param('athleteId') athleteId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 5, // 5mb
          }),
          new FileTypeValidator({
            fileType: '.(png|jpg|jpeg|pdf)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.uploadAthleteProfilePhotoUseCase.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
      entityId: athleteId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case InvalidFileTypeError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }

  @UseGuards(NormalUserRoleGuard)
  @Post('/normal-user/profile/photo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadNormalUserProfilePhoto(
    @CurrentUser() user: UserPayload,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 5, // 5mb
          }),
          new FileTypeValidator({
            fileType: '.(png|jpg|jpeg|pdf)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const userId = user.sub;

    const result = await this.uploadNormalUserProfilePhotoUseCase.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
      entityId: userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case InvalidFileTypeError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { url } = result.value;

    return { url };
  }

  @UseGuards(CoachRoleGuard)
  @Delete('/coach/profile/photo')
  async deleteCoachProfilePhoto(@CurrentUser() user: UserPayload) {
    const userId = user.sub;

    const result = await this.deleteCoachProfilePhotoUseCase.execute({
      entityId: userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }

  @UseGuards(CoachRoleGuard)
  @Delete('/coach/athlete/profile/photo/:athleteId')
  async deleteAthleteProfilePhotoFromCoach(
    @Param('athleteId') athleteId: string,
  ) {
    const result = await this.deleteAthleteProfilePhotoUseCase.execute({
      entityId: athleteId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }

  @Delete('/athlete/profile/photo')
  async deleteAthleteProfilePhoto(@CurrentUser() user: UserPayload) {
    const userId = user.sub;

    const result = await this.deleteAthleteProfilePhotoUseCase.execute({
      entityId: userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }

  @UseGuards(NormalUserRoleGuard)
  @Delete('/normal-user/profile/photo')
  async deleteNormalUserProfilePhoto(@CurrentUser() user: UserPayload) {
    const userId = user.sub;

    const result = await this.deleteNormalUserProfilePhotoUseCase.execute({
      entityId: userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
