/*
  Warnings:

  - You are about to drop the column `user_id` on the `Profile` table. All the data in the column will be lost.
  - The primary key for the `UsersRole` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[device_id]` on the table `Device` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Made the column `user_id` on table `Device` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `user_id` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_project_id_fkey";

-- DropForeignKey
ALTER TABLE "Index" DROP CONSTRAINT "Index_document_id_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_user_id_fkey";

-- DropIndex
DROP INDEX "Profile_user_id_key";

-- DropIndex
DROP INDEX "UsersRole_role_id_idx";

-- DropIndex
DROP INDEX "UsersRole_user_id_idx";

-- AlterTable
ALTER TABLE "Device" ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Index" ADD COLUMN     "source" TEXT;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "user_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "account_type" SET DEFAULT 'email';

-- AlterTable
ALTER TABLE "UsersRole" DROP CONSTRAINT "UsersRole_pkey";

-- DropTable
DROP TABLE "Document";

-- CreateTable
CREATE TABLE "Docs" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "Docs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Device_device_id_key" ON "Device"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_user_id_key" ON "Profile"("user_id");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Docs" ADD CONSTRAINT "Docs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Index" ADD CONSTRAINT "Index_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "Docs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
