/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `Comment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Comment_token_key";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "expiresAt",
DROP COLUMN "token";
