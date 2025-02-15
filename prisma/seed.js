import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const plan = await prisma.plan.create({
    data: {
      name: 'Plano Premium',
      price: 100,
      lessonsPerWeek: 4,
      totalLessons: 12,
      description: "Ideal para quem deseja aprimorar seus estudos, contando com um acompanhamento leve e focado para fortalecer sua autonomia."
    },
  });
  console.log(plan)
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
