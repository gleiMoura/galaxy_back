/*
  Warnings:

  - Added the required column `scheduledAt` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ClassStatus" AS ENUM ('SCHEDULED', 'MISSED', 'CANCELED', 'MINISTERED', 'COMPLETED', 'DISPUTE');

-- DropIndex
DROP INDEX "Student_password_key";

-- DropIndex
DROP INDEX "Teacher_password_key";

-- AlterTable
ALTER TABLE "Availability" ADD COLUMN     "isExtraHour" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "startTime" SET DATA TYPE TEXT,
ALTER COLUMN "endTime" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "scheduledAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "ClassStatus" NOT NULL DEFAULT 'SCHEDULED',
ADD COLUMN     "teacherMarkedAt" TIMESTAMP(3),
ALTER COLUMN "pdfUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "role" SET DEFAULT 'student';

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "role" SET DEFAULT 'teacher';
