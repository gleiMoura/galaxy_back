/*
  Warnings:

  - You are about to drop the column `monthTotalLessons` on the `Contract` table. All the data in the column will be lost.
  - Added the required column `firstMonthLessons` to the `Contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondMonthLessons` to the `Contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thirdMonthLessons` to the `Contract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "monthTotalLessons",
ADD COLUMN     "firstMonthLessons" INTEGER NOT NULL,
ADD COLUMN     "secondMonthLessons" INTEGER NOT NULL,
ADD COLUMN     "thirdMonthLessons" INTEGER NOT NULL;
