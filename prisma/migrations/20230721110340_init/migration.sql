-- CreateTable
CREATE TABLE "Queue" (
    "id" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "queueId" TEXT NOT NULL,
    "totalMessages" INTEGER NOT NULL,
    "statusId" TEXT NOT NULL,

    CONSTRAINT "Queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueueStatus" (
    "id" TEXT NOT NULL,
    "statusName" TEXT NOT NULL,
    "statusDescription" TEXT NOT NULL,

    CONSTRAINT "QueueStatus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "QueueStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
