import prisma from "../src/config/prisma.js";
import { hashPassword } from "../src/utils/password.js";

async function main() {
  const passwordHash = await hashPassword("Seed123!");

  const user = await prisma.user.upsert({
    where: { email: "seed@example.com" },
    update: {},
    create: {
      username: "seed_user",
      email: "seed@example.com",
      passwordHash,
    },
  });

  await prisma.game.createMany({
    data: [
      {
        title: "The Witcher 3: Wild Hunt",
        platform: "PC",
        developer: "CD Projekt Red",
        status: "ZERADO",
        favorite: true,
        rating: 9.8,
        releaseDate: new Date("2015-05-19"),
        userId: user.id,
      },
      {
        title: "Red Dead Redemption 2",
        platform: "PS5",
        developer: "Rockstar Games",
        status: "JOGANDO",
        favorite: true,
        rating: 9.7,
        releaseDate: new Date("2018-10-26"),
        userId: user.id,
      },
      {
        title: "Baldur's Gate 3",
        platform: "PC",
        developer: "Larian Studios",
        status: "QUERO_JOGAR",
        favorite: false,
        rating: null,
        releaseDate: new Date("2023-08-03"),
        userId: user.id,
      },
      {
        title: "Hades",
        platform: "Switch",
        developer: "Supergiant Games",
        status: "ZERADO",
        favorite: false,
        rating: 9.4,
        releaseDate: new Date("2020-09-17"),
        userId: user.id,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
