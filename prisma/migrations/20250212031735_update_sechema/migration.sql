/*
  Warnings:

  - Added the required column `profileUrl` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileUrl` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "profileUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "profileUrl" TEXT NOT NULL;
