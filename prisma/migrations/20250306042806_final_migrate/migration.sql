/*
  Warnings:

  - You are about to drop the column `projectId` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusProject" AS ENUM ('active', 'archive', 'pending');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "status" "StatusProject" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "projectId",
ADD COLUMN     "priority" "TicketPriority" NOT NULL DEFAULT 'LOW',
ADD COLUMN     "status" "TicketStatus" NOT NULL DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Status";
