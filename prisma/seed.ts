import { PrismaClient } from '@prisma/client';
import { v7 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  const rootId = v7();
  const honnsyaId = v7();
  const tokyoId = v7();
  const osakaId = v7();
  const hukuokaId = v7();
  const forporafePlanningOfficeId = v7();
  const managementDepartmentId = v7();
  const rookieTrainingDepartmentId = v7();
  const techDivisionId = v7();
  const educationDevelopmentDepartmentId = v7();
  const tokyoItsGroup = v7();
  const tokyoItsSalesDepartment = v7();
  const tokyoItsTechSection = v7();
  const tokyoEngGroup = v7();
  const tokyoEngSalesDepartment = v7();
  const tokyoEngTechSection = v7();
  const osakaSalesDepartment = v7();
  const osakaTechSection = v7();
  const hukuokaSalesDepartment = v7();
  const hukuokaTechSection = v7();

  await prisma.organization.createMany({
    data: [
      { id: rootId, name: '取締役会', description: '取締役会', updateUser: 'root' },
      { id: honnsyaId, name: '本社', description: '本社', parentId: rootId, updateUser: 'root' },
      { id: tokyoId, name: '東京支店', description: '東京支店', parentId: rootId, updateUser: 'root' },
      { id: osakaId, name: '大阪支店', parentId: rootId, description: '大阪支店', updateUser: 'root' },
      { id: hukuokaId, name: '福岡支店', parentId: rootId, description: '福岡支店', updateUser: 'root' },
      {
        id: forporafePlanningOfficeId,
        name: '経営企画室',
        parentId: honnsyaId,
        description: '本社/経営企画室',
        updateUser: 'root',
      },
      {
        id: managementDepartmentId,
        name: '管理部',
        parentId: honnsyaId,
        description: '本社/管理部',
        updateUser: 'root',
      },
      {
        id: rookieTrainingDepartmentId,
        name: '新人研修チーム',
        parentId: managementDepartmentId,
        description: '本社/管理部/新人研修チーム',
        updateUser: 'root',
      },
      {
        id: techDivisionId,
        name: '技術本部',
        parentId: honnsyaId,
        description: '本社/技術本部',
        updateUser: 'root',
      },
      {
        id: educationDevelopmentDepartmentId,
        name: 'E&Dチーム',
        parentId: techDivisionId,
        description: '本社/技術本部/E&Dチーム',
        updateUser: 'root',
      },
      {
        id: tokyoItsGroup,
        name: 'ITSグループ',
        parentId: tokyoId,
        description: '東京支店/ITSグループ',
        updateUser: 'root',
      },
      {
        id: tokyoItsSalesDepartment,
        name: '営業部',
        parentId: tokyoItsGroup,
        description: '東京支店/ITSグループ/営業部',
        updateUser: 'root',
      },
      {
        id: tokyoItsTechSection,
        name: '技術セクション',
        parentId: tokyoItsGroup,
        description: '東京支店/ITSグループ/技術セクション',
        updateUser: 'root',
      },
      {
        id: tokyoEngGroup,
        name: 'ENGグループ',
        parentId: tokyoId,
        description: '東京支店/ENGグループ',
        updateUser: 'root',
      },
      {
        id: tokyoEngSalesDepartment,
        name: '営業部',
        parentId: tokyoEngGroup,
        description: '東京支店/ENGグループ/営業部',
        updateUser: 'root',
      },
      {
        id: tokyoEngTechSection,
        name: '技術セクション',
        parentId: tokyoEngGroup,
        description: '東京支店/ENGグループ/技術セクション',
        updateUser: 'root',
      },
      {
        id: osakaSalesDepartment,
        name: '営業部',
        parentId: osakaId,
        description: '大阪支店/営業部',
        updateUser: 'root',
      },
      {
        id: osakaTechSection,
        name: '技術セクション',
        parentId: osakaId,
        description: '大阪支店/技術セクション',
        updateUser: 'root',
      },
      {
        id: hukuokaSalesDepartment,
        name: '営業部',
        parentId: hukuokaId,
        description: '福岡支店/営業部',
        updateUser: 'root',
      },
      {
        id: hukuokaTechSection,
        name: '技術セクション',
        parentId: hukuokaId,
        description: '福岡支店/技術セクション',
        updateUser: 'root',
      },
    ],
  });

  const employeeNoTagId = v7();
  await prisma.tag.createMany({
    data: [
      { id: employeeNoTagId, name: '会社員', category: 'organization', updateUser: 'root' },
      { id: v7(), name: '部長', category: 'organization', updateUser: 'root' },
      { id: v7(), name: '副部長', category: 'organization', updateUser: 'root' },
      { id: v7(), name: 'リーダー', category: 'organization', updateUser: 'root' },
      { id: v7(), name: 'サブリーダー', category: 'organization', updateUser: 'root' },
      { id: v7(), name: '社長', category: 'organization', updateUser: 'root' },
    ],
  });

  console.log('Data seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
