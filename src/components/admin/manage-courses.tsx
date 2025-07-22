"use client";
import { useEffect, useState } from "react";
import { AddCourseModal } from "./add-course-modal";

function EditCourseModal({ open, onClose, onSuccess, course }: { open: boolean; onClose: () => void; onSuccess: () => void; course: any }) {
  const [title, setTitle] = useState(course?.title || "");
  const [slug, setSlug] = useState(course?.slug || "");
  const [description, setDescription] = useState(course?.description || "");
  const [imageUrl, setImageUrl] = useState(course?.imageUrl || "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(course?.title || "");
    setSlug(course?.slug || "");
    setDescription(course?.description || "");
    setImageUrl(course?.imageUrl || "");
  }, [course, open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/admin/course", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: course.id, title, slug, description, imageUrl }),
    });
    setLoading(false);
    if (res.ok) {
      onSuccess();
      onClose();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to update course");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Course</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input className="w-full px-3 py-2 border rounded" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input className="w-full px-3 py-2 border rounded" value={slug} onChange={e => setSlug(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea className="w-full px-3 py-2 border rounded" value={description} onChange={e => setDescription(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input className="w-full px-3 py-2 border rounded" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ChapterForm({ onSubmit, initial, onCancel }: { onSubmit: (data: any) => void; initial?: any; onCancel: () => void }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [order, setOrder] = useState(initial?.order || 1);
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit({ title, order }); }} className="space-y-2">
      <input className="w-full px-3 py-2 border rounded" value={title} onChange={e => setTitle(e.target.value)} placeholder="Chapter title" required />
      <input className="w-full px-3 py-2 border rounded" type="number" value={order} onChange={e => setOrder(Number(e.target.value))} placeholder="Order" min={1} required />
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-3 py-1 rounded border">Cancel</button>
        <button type="submit" className="px-3 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90">Save</button>
      </div>
    </form>
  );
}

function TopicForm({ onSubmit, initial, onCancel }: { onSubmit: (data: any) => void; initial?: any; onCancel: () => void }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [order, setOrder] = useState(initial?.order || 1);
  const [content, setContent] = useState(initial?.content || "");
  const [hasCodeEditor, setHasCodeEditor] = useState(initial?.hasCodeEditor || false);
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit({ title, slug, order, content, hasCodeEditor }); }} className="space-y-2">
      <input className="w-full px-3 py-2 border rounded" value={title} onChange={e => setTitle(e.target.value)} placeholder="Topic title" required />
      <input className="w-full px-3 py-2 border rounded" value={slug} onChange={e => setSlug(e.target.value)} placeholder="Slug" required />
      <input className="w-full px-3 py-2 border rounded" type="number" value={order} onChange={e => setOrder(Number(e.target.value))} placeholder="Order" min={1} required />
      <textarea className="w-full px-3 py-2 border rounded" value={content} onChange={e => setContent(e.target.value)} placeholder="Content" required />
      <label className="flex items-center gap-2"><input type="checkbox" checked={hasCodeEditor} onChange={e => setHasCodeEditor(e.target.checked)} />Has Code Editor</label>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-3 py-1 rounded border">Cancel</button>
        <button type="submit" className="px-3 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90">Save</button>
      </div>
    </form>
  );
}

function ManageChaptersModal({ open, onClose, course }: { open: boolean; onClose: () => void; course: any }) {
  if (!open || !course) return null;
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addChapter, setAddChapter] = useState(false);
  const [editChapter, setEditChapter] = useState<any | null>(null);
  const [addTopic, setAddTopic] = useState<any | null>(null); // chapter
  const [editTopic, setEditTopic] = useState<any | null>(null); // topic

  const fetchChapters = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/courses?id=${course.id}`);
      const data = await res.json();
      setChapters(data.courses[0]?.chapters || []);
    } catch (e) {
      setError("Failed to fetch chapters");
    }
    setLoading(false);
  };

  useEffect(() => { if (open && course) fetchChapters(); }, [open, course]);

  const handleAddChapter = async (data: any) => {
    const res = await fetch("/api/admin/chapter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, courseId: course.id }),
    });
    if (res.ok) { setAddChapter(false); fetchChapters(); }
    else alert("Failed to add chapter");
  };
  const handleEditChapter = async (data: any) => {
    const res = await fetch("/api/admin/chapter", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, id: editChapter.id }),
    });
    if (res.ok) { setEditChapter(null); fetchChapters(); }
    else alert("Failed to update chapter");
  };
  const handleDeleteChapter = async (id: string) => {
    if (!confirm("Delete this chapter?")) return;
    const res = await fetch("/api/admin/chapter", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchChapters();
    else alert("Failed to delete chapter");
  };
  const handleAddTopic = async (chapterId: string, data: any) => {
    const res = await fetch("/api/admin/topic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, chapterId }),
    });
    if (res.ok) { setAddTopic(null); fetchChapters(); }
    else alert("Failed to add topic");
  };
  const handleEditTopic = async (data: any) => {
    const res = await fetch("/api/admin/topic", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, id: editTopic.id }),
    });
    if (res.ok) { setEditTopic(null); fetchChapters(); }
    else alert("Failed to update topic");
  };
  const handleDeleteTopic = async (id: string) => {
    if (!confirm("Delete this topic?")) return;
    const res = await fetch("/api/admin/topic", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchChapters();
    else alert("Failed to delete topic");
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto">
      <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Manage Chapters & Topics for {course.title}</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {loading ? <p>Loading...</p> : (
          <>
            <button onClick={() => setAddChapter(true)} className="mb-4 px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90">+ Add Chapter</button>
            <ul className="space-y-4">
              {chapters.map((chapter) => (
                <li key={chapter.id} className="border rounded p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">{chapter.title} <span className="text-xs text-muted-foreground">(Order: {chapter.order})</span></div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditChapter(chapter)} className="px-2 py-1 rounded border text-xs">Edit</button>
                      <button onClick={() => handleDeleteChapter(chapter.id)} className="px-2 py-1 rounded bg-red-600 text-white text-xs">Delete</button>
                      <button onClick={() => setAddTopic(chapter)} className="px-2 py-1 rounded bg-primary text-primary-foreground text-xs">+ Topic</button>
                    </div>
                  </div>
                  <ul className="space-y-2 ml-4">
                    {chapter.topics.map((topic: any) => (
                      <li key={topic.id} className="flex items-center gap-2">
                        <span className="font-medium">{topic.title}</span>
                        <span className="text-xs text-muted-foreground">(Order: {topic.order})</span>
                        <button onClick={() => setEditTopic(topic)} className="px-2 py-1 rounded border text-xs">Edit</button>
                        <button onClick={() => handleDeleteTopic(topic.id)} className="px-2 py-1 rounded bg-red-600 text-white text-xs">Delete</button>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </>
        )}
        {addChapter && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"><div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md"><h3 className="font-bold mb-2">Add Chapter</h3><ChapterForm onSubmit={handleAddChapter} onCancel={() => setAddChapter(false)} /></div></div>}
        {editChapter && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"><div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md"><h3 className="font-bold mb-2">Edit Chapter</h3><ChapterForm onSubmit={handleEditChapter} initial={editChapter} onCancel={() => setEditChapter(null)} /></div></div>}
        {addTopic && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"><div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md"><h3 className="font-bold mb-2">Add Topic</h3><TopicForm onSubmit={data => handleAddTopic(addTopic.id, data)} onCancel={() => setAddTopic(null)} /></div></div>}
        {editTopic && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"><div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md"><h3 className="font-bold mb-2">Edit Topic</h3><TopicForm onSubmit={handleEditTopic} initial={editTopic} onCancel={() => setEditTopic(null)} /></div></div>}
        <button onClick={onClose} className="mt-6 px-4 py-2 rounded border">Close</button>
      </div>
    </div>
  );
}

export function ManageCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editCourse, setEditCourse] = useState<any | null>(null);
  const [manageChapters, setManageChapters] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (e) {
      setError("Failed to fetch courses");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    const res = await fetch("/api/admin/course", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchCourses();
    else alert("Failed to delete course");
  };

  return (
    <div className="bg-card p-6 rounded-lg border overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Manage Content</h2>
        <button
          className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
          onClick={() => setShowAdd(true)}
        >
          + Add Course
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left">Course</th>
              <th className="py-2 px-4 text-left">Chapters</th>
              <th className="py-2 px-4 text-left">Topics</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-b hover:bg-muted/50">
                <td className="py-2 px-4 font-medium">{course.title}</td>
                <td className="py-2 px-4">{course.chapters.length}</td>
                <td className="py-2 px-4">{course.chapters.reduce((sum: number, ch: any) => sum + ch.topics.length, 0)}</td>
                <td className="py-2 px-4 flex gap-2">
                  <button
                    className="px-2 py-1 rounded bg-muted hover:bg-muted/80 border text-xs"
                    onClick={() => setEditCourse(course)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-xs"
                    onClick={() => setManageChapters(course)}
                  >
                    Manage
                  </button>
                  <button
                    className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-xs"
                    onClick={() => handleDelete(course.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <AddCourseModal open={showAdd} onClose={() => setShowAdd(false)} onSuccess={fetchCourses} />
      <EditCourseModal open={!!editCourse} onClose={() => setEditCourse(null)} onSuccess={fetchCourses} course={editCourse} />
      <ManageChaptersModal open={!!manageChapters} onClose={() => setManageChapters(null)} course={manageChapters} />
    </div>
  );
} 