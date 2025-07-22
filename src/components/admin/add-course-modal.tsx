"use client";
import { useState } from "react";

export function AddCourseModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/admin/course", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, description, imageUrl }),
    });
    setLoading(false);
    if (res.ok) {
      setTitle(""); setSlug(""); setDescription(""); setImageUrl("");
      onSuccess();
      onClose();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to add course");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Course</h2>
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
            <button type="submit" className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>{loading ? "Adding..." : "Add Course"}</button>
          </div>
        </form>
      </div>
    </div>
  );
} 