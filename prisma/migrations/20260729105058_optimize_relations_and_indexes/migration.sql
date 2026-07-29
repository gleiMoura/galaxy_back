/*
  Warnings:

  - You are about to alter the column `amount` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `price` on the `Plan` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to drop the column `subject` on the `StudentInterest` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `StudentPayment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- DropForeignKey
ALTER TABLE "Availability" DROP CONSTRAINT "Availability_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "StudentInterest" DROP CONSTRAINT "StudentInterest_studentId_fkey";

-- DropForeignKey
ALTER TABLE "StudentPayment" DROP CONSTRAINT "StudentPayment_studentId_fkey";

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Plan" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "StudentInterest" DROP COLUMN "subject";

-- AlterTable
ALTER TABLE "StudentPayment" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2);

-- CreateIndex
CREATE INDEX "Availability_teacherId_idx" ON "Availability"("teacherId");

-- CreateIndex
CREATE INDEX "Availability_teacherId_weekday_idx" ON "Availability"("teacherId", "weekday");

-- CreateIndex
CREATE INDEX "Class_studentId_idx" ON "Class"("studentId");

-- CreateIndex
CREATE INDEX "Class_teacherId_idx" ON "Class"("teacherId");

-- CreateIndex
CREATE INDEX "Class_scheduledAt_idx" ON "Class"("scheduledAt");

-- CreateIndex
CREATE INDEX "Class_teacherId_scheduledAt_idx" ON "Class"("teacherId", "scheduledAt");

-- CreateIndex
CREATE INDEX "Contract_studentId_idx" ON "Contract"("studentId");

-- CreateIndex
CREATE INDEX "Contract_teacherId_idx" ON "Contract"("teacherId");

-- CreateIndex
CREATE INDEX "Contract_planId_idx" ON "Contract"("planId");

-- CreateIndex
CREATE INDEX "Payment_teacherId_idx" ON "Payment"("teacherId");

-- CreateIndex
CREATE INDEX "StudentInterest_studentId_idx" ON "StudentInterest"("studentId");

-- CreateIndex
CREATE INDEX "StudentPayment_studentId_idx" ON "StudentPayment"("studentId");

-- CreateIndex
CREATE INDEX "StudentPayment_status_idx" ON "StudentPayment"("status");

-- AddForeignKey
ALTER TABLE "StudentInterest" ADD CONSTRAINT "StudentInterest_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPayment" ADD CONSTRAINT "StudentPayment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
