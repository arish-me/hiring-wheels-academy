import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

function CourseIcon() {
  // Simple book icon SVG (Heroicons outline)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-20 h-20 text-primary/70"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v12m0 0c-2.21 0-4-1.79-4-4V6a2 2 0 012-2h4a2 2 0 012 2v8c0 2.21-1.79 4-4 4z"
      />
    </svg>
  );
}

export default async function Home() {
  const courses = await prisma.course.findMany({
    orderBy: { title: "asc" },
  });

  return (
    <div className="font-sans min-h-screen p-8 pb-20 sm:p-20 bg-background">
      <section className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Hiring Wheels Academy</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Explore and learn programming, development tools, and technologies. All courses are dynamic and admin-managed.
        </p>
      </section>
      <section className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Available Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/${course.slug}`}
              className="group bg-card rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col items-center border border-border hover:border-primary"
            >
              <div className="w-20 h-20 mb-4 relative flex items-center justify-center">
                {course.imageUrl ? (
                  <Image
                    src={course.imageUrl}
                    alt={course.title}
                    fill
                    className="object-contain rounded-lg"
                    sizes="80px"
                  />
                ) : (
                  <CourseIcon />
                )}
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                {course.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {course.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
