import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { updateProfile } from "@/lib/nextrep/storage";

export function AccountEditor({ localName }: { localName: string }) {
  const { user } = useSession();
  const [name, setName] = useState(localName);
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name, bio, avatar_url")
        .eq("id", user.id)
        .maybeSingle();
      if (cancelled || !data) return;
      setName(data.display_name ?? localName);
      setBio(data.bio ?? "");
      if (data.avatar_url) {
        setAvatarPath(data.avatar_url);
        await resolveAvatar(data.avatar_url);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  async function resolveAvatar(path: string) {
    if (path.startsWith("http")) {
      setAvatarUrl(path);
      return;
    }
    const { data } = await supabase.storage.from("avatars").createSignedUrl(path, 60 * 60);
    if (data?.signedUrl) setAvatarUrl(data.signedUrl);
  }

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be under 5MB");
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) {
      setUploading(false);
      return toast.error(error.message);
    }
    if (avatarPath && !avatarPath.startsWith("http")) {
      await supabase.storage.from("avatars").remove([avatarPath]);
    }
    await supabase.from("profiles").update({ avatar_url: path }).eq("id", user.id);
    setAvatarPath(path);
    await resolveAvatar(path);
    setUploading(false);
    toast.success("Photo updated");
  }

  async function save() {
    const trimmed = name.trim();
    if (!trimmed) return toast.error("Name cannot be empty");
    if (trimmed.length > 60) return toast.error("Name must be under 60 characters");
    if (bio.length > 300) return toast.error("Bio must be under 300 characters");
    setSaving(true);
    updateProfile({ name: trimmed });
    if (user) {
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: trimmed, bio: bio.trim() })
        .eq("id", user.id);
      if (error) {
        setSaving(false);
        return toast.error(error.message);
      }
    }
    setSaving(false);
    toast.success("Profile saved");
  }

  return (
    <div className="glass rounded-3xl p-4 mb-4 shadow-[var(--shadow-card)]">
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Your profile</div>

      <div className="flex items-center gap-4 mb-5">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="relative w-20 h-20 rounded-2xl overflow-hidden grid place-items-center border border-white/10 shrink-0"
          style={avatarUrl ? undefined : { background: "var(--gradient-primary)" }}
          aria-label="Upload profile photo"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="Profile photo" className="w-full h-full object-cover" />
          ) : (
            <UserIcon className="w-8 h-8 text-primary-foreground" />
          )}
          <span className="absolute inset-x-0 bottom-0 h-6 bg-black/60 grid place-items-center">
            {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
          </span>
        </button>
        <div className="text-xs text-muted-foreground">
          Tap the photo to upload a new one.
          <br />
          JPG or PNG, up to 5MB.
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickFile} />
      </div>

      <Field label="Name">
        <input
          value={name}
          maxLength={60}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-sm outline-none focus:border-primary/60"
        />
      </Field>

      <Field label="Email">
        <input
          value={user?.email ?? ""}
          readOnly
          className="w-full h-11 rounded-xl bg-white/[0.03] border border-white/5 px-3 text-sm text-muted-foreground outline-none"
        />
      </Field>

      <Field label={`Bio (${bio.length}/300)`}>
        <textarea
          value={bio}
          maxLength={300}
          rows={3}
          onChange={(e) => setBio(e.target.value)}
          placeholder="A short line about your training..."
          className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-sm outline-none resize-none focus:border-primary/60"
        />
      </Field>

      <button
        onClick={save}
        disabled={saving}
        className="w-full h-11 rounded-xl font-medium text-primary-foreground disabled:opacity-60 active:scale-[0.99] transition-transform"
        style={{ background: "var(--gradient-primary)" }}
      >
        {saving ? "Saving..." : "Save profile"}
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">{label}</div>
      {children}
    </div>
  );
}
