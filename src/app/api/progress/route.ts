import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { topicId, completed } = await req.json();
  if (!topicId || typeof completed !== "boolean") {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const progress = await prisma.progress.upsert({
    where: {
      userId_topicId: {
        userId: session.user.id,
        topicId,
      },
    },
    update: {
      completed,
      completedAt: completed ? new Date() : null,
    },
    create: {
      userId: session.user.id,
      topicId,
      completed,
      completedAt: completed ? new Date() : null,
    },
  });
  return NextResponse.json({ success: true, progress });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");
  if (!courseId) {
    return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
  }
  // Get all progress for this user and course
  const topics = await prisma.topic.findMany({
    where: { chapter: { courseId } },
    select: { id: true },
  });
  const topicIds = topics.map((t) => t.id);
  const progress = await prisma.progress.findMany({
    where: {
      userId: session.user.id,
      topicId: { in: topicIds },
    },
  });
  return NextResponse.json({ progress });
} 