/*
  Warnings:

  - Added the required column `category` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "ExerciseCategory" AS ENUM ('CHEST', 'BACK', 'LEGS', 'SHOULDERS', 'BICEPS', 'TRICEPS', 'FOREARMS');

-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_coachId_fkey";

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "category" "ExerciseCategory" NOT NULL,
ADD COLUMN     "dayOfWeek" "DayOfWeek",
ALTER COLUMN "coachId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "Coach"("id") ON DELETE SET NULL ON UPDATE CASCADE;
