import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { title, slug, order, content, chapterId, hasCodeEditor } = await req.json();
  if (!title || !slug || !content || !chapterId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const topic = await prisma.topic.create({
    data: { title, slug, order: order || 1, content, chapterId, hasCodeEditor: !!hasCodeEditor },
  });
  return NextResponse.json({ topic });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, title, slug, order, content, hasCodeEditor } = await req.json();
  if (!id || !title || !slug || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const topic = await prisma.topic.update({
    where: { id },
    data: { title, slug, order, content, hasCodeEditor: !!hasCodeEditor },
  });
  return NextResponse.json({ topic });
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
  await prisma.topic.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 