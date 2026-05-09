import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Camera, Trash2, Upload, Pencil, Save, X } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth/AuthContext";
import { notify } from "@/lib/auth/feedback";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — Scalio Media" },
      { name: "description", content: "View and edit your account profile." },
    ],
  }),
  component: ProfilePage,
});

interface ProfileState {
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}

function ProfilePage() {
  const { currentUser, updateUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ProfileState>({
    name: currentUser?.name ?? "",
    email: currentUser?.email ?? "",
    phone: "",
    avatarUrl: currentUser?.avatarUrl,
  });

  useEffect(() => {
    setForm((f) => ({
      ...f,
      name: currentUser?.name ?? f.name,
      email: currentUser?.email ?? f.email,
      avatarUrl: currentUser?.avatarUrl ?? f.avatarUrl,
    }));
  }, [currentUser]);

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, avatarUrl: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const onSave = () => {
    if (currentUser) {
      updateUser({ name: form.name, email: form.email, avatarUrl: form.avatarUrl });
    }
    setEditing(false);
    notify("Profile saved");
  };

  const initial = (form.name || form.email || "?").charAt(0).toUpperCase();

  return (
    <div className="bg-white text-[#1A1A2E] min-h-screen">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <header className="mb-10">
            <h1 className="font-display font-bold text-4xl text-[#1A1A2E]">Your profile</h1>
            <p className="mt-2 text-[#6B7280]">Manage your personal details and package.</p>
          </header>

          <section className="rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-card">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-brand text-white flex items-center justify-center text-3xl font-bold shadow-card">
                  {form.avatarUrl ? (
                    <img
                      src={form.avatarUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{initial}</span>
                  )}
                </div>
                {editing && (
                  <button
                    type="button"
                    aria-label="Change profile picture"
                    onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#1A1A2E] text-white flex items-center justify-center shadow-glow"
                  >
                    <Camera size={14} />
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onUpload}
                />
              </div>

              <div className="flex-1">
                <p className="font-display font-bold text-xl text-[#1A1A2E]">
                  {form.name || "Unnamed user"}
                </p>
                <p className="text-sm text-[#6B7280]">{form.email || "—"}</p>
                {editing && (
                  <div className="mt-3 flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => fileRef.current?.click()}
                    >
                      <Upload size={14} className="mr-1" /> Upload
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setForm((f) => ({ ...f, avatarUrl: undefined }))}
                    >
                      <Trash2 size={14} className="mr-1" /> Remove
                    </Button>
                  </div>
                )}
              </div>

              <div className="sm:ml-auto">
                {editing ? (
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                      <X size={14} className="mr-1" /> Cancel
                    </Button>
                    <Button type="button" onClick={onSave}>
                      <Save size={14} className="mr-1" /> Save
                    </Button>
                  </div>
                ) : (
                  <Button type="button" onClick={() => setEditing(true)}>
                    <Pencil size={14} className="mr-1" /> Edit
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  disabled={!editing}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  disabled={!editing}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  disabled={!editing}
                  placeholder="+91 9XXXXXXXXX"
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
            </div>
          </section>

          <section className="mt-8 grid sm:grid-cols-3 gap-4">
            <InfoTile label="Package" value={currentUser?.packageName || "Free"} />
            <InfoTile label="Last login" value={currentUser?.lastLogin || "—"} />
            <InfoTile label="Account status" value={currentUser ? "Active" : "Guest"} />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-[#F5F7FA] p-5">
      <p className="text-xs uppercase tracking-widest font-bold text-[#1B2A4A]">{label}</p>
      <p className="mt-2 text-[#1A1A2E] font-semibold">{value}</p>
    </div>
  );
}
