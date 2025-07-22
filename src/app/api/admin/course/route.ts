import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { title, slug, description, imageUrl } = await req.json();
  if (!title || !slug || !description) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const exists = await prisma.course.findUnique({ where: { slug } });
  if (exists) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
  }
  const course = await prisma.course.create({
    data: { title, slug, description, imageUrl },
  });
  return NextResponse.json({ course });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, title, slug, description, imageUrl } = await req.json();
  if (!id || !title || !slug || !description) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const course = await prisma.course.update({
    where: { id },
    data: { title, slug, description, imageUrl },
  });
  return NextResponse.json({ course });
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
  await prisma.course.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 