/*
  Warnings:

  - The primary key for the `ResourceMetadata` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `filedName` on the `ResourceMetadata` table. All the data in the column will be lost.
  - Added the required column `fieldName` to the `ResourceMetadata` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ResourceMetadata" DROP CONSTRAINT "ResourceMetadata_pkey",
DROP COLUMN "filedName",
ADD COLUMN     "fieldName" TEXT NOT NULL,
ADD CONSTRAINT "ResourceMetadata_pkey" PRIMARY KEY ("tagId", "fieldName");
