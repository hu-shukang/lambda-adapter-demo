-- CreateTable
CREATE TABLE "ResourceMetadata" (
    "tagId" UUID NOT NULL,
    "filedName" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "validation" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "ResourceMetadata_pkey" PRIMARY KEY ("tagId","filedName")
);

-- AddForeignKey
ALTER TABLE "ResourceMetadata" ADD CONSTRAINT "ResourceMetadata_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
