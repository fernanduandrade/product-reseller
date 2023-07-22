/*
  Warnings:

  - The primary key for the `QueueStatus` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `QueueStatus` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `statusId` on the `Queue` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Queue" DROP CONSTRAINT "Queue_statusId_fkey";

-- AlterTable
ALTER TABLE "Queue" DROP COLUMN "statusId",
ADD COLUMN     "statusId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "QueueStatus" DROP CONSTRAINT "QueueStatus_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "QueueStatus_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "QueueStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
