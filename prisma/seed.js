const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const F = [
  ['Riya', 25, 4.9, '₹700', '#E8B08A', '#A0405F', 'linear-gradient(160deg,#FFD6E7,#FF8FBF)', '#E0186F', 1],
  ['Aarav', 27, 4.8, '₹600', '#C68A62', '#B0507A', 'linear-gradient(160deg,#FFE3EF,#FFB3D1)', '#FFF1F6', 0],
  ['Meera', 26, 4.9, '₹750', '#8A5A3C', '#8E2B55', 'linear-gradient(160deg,#FFC1D9,#FF7DB4)', '#FFB3D1', 1],
  ['Kabir', 29, 4.7, '₹800', '#E0A47C', '#A0405F', 'linear-gradient(160deg,#FFF1F6,#FF9CC8)', '#FF5C9E', 0]
];

async function main() {
  console.log(`Start seeding ...`)
  for (const c of F) {
    const companion = await prisma.companion.create({
      data: {
        name: c[0],
        age: c[1],
        rating: c[2],
        rate: c[3],
        sk: c[4],
        hr: c[5],
        bg: c[6],
        sh: c[7],
        long: c[8],
      }
    })
    console.log(`Created companion with id: ${companion.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
