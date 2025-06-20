/*
  Warnings:

  - You are about to drop the column `ticketId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_TicketComments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "_TicketComments" DROP CONSTRAINT "_TicketComments_A_fkey";

-- DropForeignKey
ALTER TABLE "_TicketComments" DROP CONSTRAINT "_TicketComments_B_fkey";

-- DropIndex
DROP INDEX "User_ticketId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "ticketId";

-- DropTable
DROP TABLE "_TicketComments";
