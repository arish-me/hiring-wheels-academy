import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { title, order, courseId } = await req.json();
  if (!title || !courseId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const chapter = await prisma.chapter.create({
    data: { title, order: order || 1, courseId },
  });
  return NextResponse.json({ chapter });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, title, order } = await req.json();
  if (!id || !title) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const chapter = await prisma.chapter.update({
    where: { id },
    data: { title, order },
  });
  return NextResponse.json({ chapter });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  await prisma.chapter.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 