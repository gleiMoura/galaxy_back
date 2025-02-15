/*
  Warnings:

  - Added the required column `lessonsPerWeek` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalLessosn` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "lessonsPerWeek" INTEGER NOT NULL,
ADD COLUMN     "totalLessosn" INTEGER NOT NULL;
