import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { companionId, date, time } = await request.json();

    if (!companionId || !date || !time) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        companionId,
        date,
        time,
        status: "PENDING",
      },
    });

    return Response.json({ booking });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
