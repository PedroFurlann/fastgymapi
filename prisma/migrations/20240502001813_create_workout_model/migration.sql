/*
  Warnings:

  - You are about to drop the column `athleteId` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `coachId` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `dayOfWeek` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `normalUserId` on the `Exercise` table. All the data in the column will be lost.
  - Added the required column `workoutId` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ExerciseCategory" ADD VALUE 'OTHER';

-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_athleteId_fkey";

-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_coachId_fkey";

-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_normalUserId_fkey";

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "athleteId",
DROP COLUMN "coachId",
DROP COLUMN "dayOfWeek",
DROP COLUMN "normalUserId",
ADD COLUMN     "workoutId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "DayOfWeek";

-- CreateTable
CREATE TABLE "Workout" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "coachId" TEXT,
    "athleteId" TEXT,
    "normalUserId" TEXT,

    CONSTRAINT "Workout_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "Coach"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_normalUserId_fkey" FOREIGN KEY ("normalUserId") REFERENCES "NormalUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
