-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_normalUserId_fkey";

-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_normalUserId_fkey";

-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_workoutId_fkey";

-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_normalUserId_fkey";

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_normalUserId_fkey" FOREIGN KEY ("normalUserId") REFERENCES "NormalUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_normalUserId_fkey" FOREIGN KEY ("normalUserId") REFERENCES "NormalUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_normalUserId_fkey" FOREIGN KEY ("normalUserId") REFERENCES "NormalUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;
