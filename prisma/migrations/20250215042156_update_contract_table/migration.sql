/*
  Warnings:

  - Added the required column `contractTotalLessons` to the `Contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthTotalLessons` to the `Contract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "contractTotalLessons" INTEGER NOT NULL,
ADD COLUMN     "monthTotalLessons" INTEGER NOT NULL;
