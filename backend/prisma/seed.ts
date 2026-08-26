import prisma from "../src/config/prisma.js";

async function main() {
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
      },
      {
        title: "Red Dead Redemption 2",
        platform: "PS5",
        developer: "Rockstar Games",
        status: "JOGANDO",
        favorite: true,
        rating: 9.7,
        releaseDate: new Date("2018-10-26"),
      },
      {
        title: "Baldur's Gate 3",
        platform: "PC",
        developer: "Larian Studios",
        status: "QUERO_JOGAR",
        favorite: false,
        rating: 9.9,
        releaseDate: new Date("2023-08-03"),
      },
      {
        title: "Hades",
        platform: "Switch",
        developer: "Supergiant Games",
        status: "ZERADO",
        favorite: false,
        rating: 9.4,
        releaseDate: new Date("2020-09-17"),
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
