-- DropForeignKey
ALTER TABLE "ResourceMetadata" DROP CONSTRAINT "ResourceMetadata_tagId_fkey";

-- AddForeignKey
ALTER TABLE "ResourceMetadata" ADD CONSTRAINT "ResourceMetadata_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
