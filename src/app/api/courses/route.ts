import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const courses = await prisma.course.findMany({
    orderBy: { title: "asc" },
    include: {
      chapters: {
        include: {
          topics: true,
        },
      },
    },
  });
  return NextResponse.json({ courses });
} 