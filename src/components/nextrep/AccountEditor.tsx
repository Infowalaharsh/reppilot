import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Loader2, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { updateProfile } from "@/lib/nextrep/storage";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export type ProfileRecord = {
  displayName: string | null;
  bio: string;
  avatarUrl: string | null;
  avatarPath: string | null;
};

export function useProfileRecord() {
  const { user } = useSession();
  const [record, setRecord] = useState<ProfileRecord>({
    displayName: null,
    bio: "",
    avatarUrl: null,
    avatarPath: null,
  });

  const refresh = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("display_name, bio, avatar_url")
      .eq("id", user.id)
      .maybeSingle();
    if (!data) return;
    let url: string | null = null;
    if (data.avatar_url) {
      if (data.avatar_url.startsWith("http")) url = data.avatar_url;
      else {
        const { data: signed } = await supabase.storage
          .from("avatars")
          .createSignedUrl(data.avatar_url, 60 * 60);
        url = signed?.signedUrl ?? null;
      }
    }
    setRecord({
      displayName: data.display_name ?? null,
      bio: data.bio ?? "",
      avatarUrl: url,
      avatarPath: data.avatar_url ?? null,
    });
  }, [user?.id]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { record, refresh };
}

export function ProfileEditDrawer({
  open,
  onOpenChange,
  localName,
  record,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  localName: string;
  record: ProfileRecord;
  onSaved: () => void | Promise<void>;
}) {
  const { user } = useSession();
  const [name, setName] = useState(record.displayName ?? localName);
  const [bio, setBio] = useState(record.bio);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(record.avatarUrl);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setName(record.displayName ?? localName);
    setBio(record.bio);
    setAvatarUrl(record.avatarUrl);
  }, [open, record.displayName, record.bio, record.avatarUrl, localName]);

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
    if (record.avatarPath && !record.avatarPath.startsWith("http")) {
      await supabase.storage.from("avatars").remove([record.avatarPath]);
    }
    await supabase.from("profiles").update({ avatar_url: path }).eq("id", user.id);
    const { data: signed } = await supabase.storage.from("avatars").createSignedUrl(path, 60 * 60);
    if (signed?.signedUrl) setAvatarUrl(signed.signedUrl);
    await onSaved();
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
    await onSaved();
    setSaving(false);
    toast.success("Profile saved");
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md overflow-y-auto border-white/10 bg-background/80 backdrop-blur-2xl"
      >
        <SheetHeader className="text-left">
          <SheetTitle className="text-xl tracking-tight">Edit profile</SheetTitle>
          <SheetDescription>Update your photo, name and bio.</SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative w-24 h-24 rounded-3xl overflow-hidden grid place-items-center border border-white/10 shrink-0"
            style={avatarUrl ? undefined : { background: "var(--gradient-primary)" }}
            aria-label="Upload profile photo"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile photo" className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-9 h-9 text-primary-foreground" />
            )}
            <span className="absolute inset-x-0 bottom-0 h-7 bg-black/60 grid place-items-center">
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
            </span>
          </button>
          <div className="text-xs text-muted-foreground leading-relaxed">
            Tap the photo to upload a new one.
            <br />
            JPG or PNG, up to 5MB.
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickFile} />
        </div>

        <div className="mt-6">
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
              rows={4}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A short line about your training..."
              className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-sm outline-none resize-none focus:border-primary/60"
            />
          </Field>

          <button
            onClick={save}
            disabled={saving}
            className="w-full h-12 rounded-2xl font-medium text-primary-foreground disabled:opacity-60 active:scale-[0.99] transition-transform mt-2"
            style={{ background: "var(--gradient-primary)" }}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">{label}</div>
      {children}
    </div>
  );
}
