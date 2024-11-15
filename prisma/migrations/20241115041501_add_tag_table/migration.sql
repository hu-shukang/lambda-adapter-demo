-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "updateTime" TIMESTAMP(3) NOT NULL,
    "updateUser" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_category_updatetime" ON "Tag"("category", "updateTime");

-- CreateIndex
CREATE INDEX "UserOrganization_organizationId_idx" ON "UserOrganization"("organizationId");

-- AddForeignKey
ALTER TABLE "UserOrganization" ADD CONSTRAINT "UserOrganization_position_fkey" FOREIGN KEY ("position") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
