-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_workoutId_fkey";

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;
