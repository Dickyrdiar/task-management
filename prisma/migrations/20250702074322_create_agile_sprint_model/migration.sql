-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "agileId" TEXT;

-- CreateTable
CREATE TABLE "Agile" (
    "id" TEXT NOT NULL,
    "sprintNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Agile" ADD CONSTRAINT "Agile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agile" ADD CONSTRAINT "Agile_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_agileId_fkey" FOREIGN KEY ("agileId") REFERENCES "Agile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
