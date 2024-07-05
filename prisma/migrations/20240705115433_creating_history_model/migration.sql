-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "timesCompleted" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "History" (
    "id" TEXT NOT NULL,
    "elapsedTime" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL,
    "workoutId" TEXT NOT NULL,
    "coachId" TEXT,
    "athleteId" TEXT,
    "normalUserId" TEXT,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "Coach"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_normalUserId_fkey" FOREIGN KEY ("normalUserId") REFERENCES "NormalUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
