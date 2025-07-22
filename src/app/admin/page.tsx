import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import Link from "next/link";
import { ManageCourses } from "@/components/admin/manage-courses";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return <div className="p-8 text-center text-red-600 font-bold">Access denied. Admins only.</div>;
  }

  // Fetch all users and their progress
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      progress: {
        include: {
          topic: {
            include: {
              chapter: {
                include: { course: true },
              },
            },
          },
        },
      },
    },
  });

  // Fetch all courses
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

  // Build a summary: for each user, for each course, count completed topics
  const userSummaries = users.map((user) => {
    const courseMap: Record<string, { courseTitle: string; completed: number; total: number }> = {};
    user.progress.forEach((p) => {
      const courseId = p.topic.chapter.course.id;
      const courseTitle = p.topic.chapter.course.title;
      if (!courseMap[courseId]) {
        courseMap[courseId] = { courseTitle, completed: 0, total: 0 };
      }
      if (p.completed) courseMap[courseId].completed++;
      courseMap[courseId].total++;
    });
    return {
      ...user,
      courseProgress: Object.values(courseMap),
    };
  });

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Progress Section */}
        <div className="bg-card p-6 rounded-lg border overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">User Progress</h2>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Signup Date</th>
                <th className="py-2 px-4 text-left">Course Progress</th>
              </tr>
            </thead>
            <tbody>
              {userSummaries.map((user) => (
                <tr key={user.id} className="border-b hover:bg-muted/50">
                  <td className="py-2 px-4">{user.name || <span className="text-muted-foreground">(No name)</span>}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">{format(new Date(user.createdAt), "yyyy-MM-dd")}</td>
                  <td className="py-2 px-4">
                    {user.courseProgress.length === 0 ? (
                      <span className="text-muted-foreground">No progress</span>
                    ) : (
                      <ul className="space-y-1">
                        {user.courseProgress.map((cp) => (
                          <li key={cp.courseTitle}>
                            <span className="font-medium">{cp.courseTitle}:</span> {cp.completed} completed
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Manage Content Section */}
        <ManageCourses />
      </div>
    </div>
  );
} 