import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const companions = await prisma.companion.findMany({
      orderBy: {
        createdAt: "asc", // keep the same order as seeded
      },
    });
    return Response.json({ companions });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch companions" }, { status: 500 });
  }
}
