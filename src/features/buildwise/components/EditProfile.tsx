import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "../auth";
import type { Session } from "../types";
import { ScreenHeader } from "./ScreenHeader";

type EditProfileProps = {
  session: Session;
  onBack: () => void;
  onSaved: (session: Session) => void;
};

export function EditProfile({ session, onBack, onSaved }: EditProfileProps) {
  const [name, setName] = useState(session.name);
  const [email, setEmail] = useState(session.email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const result = updateProfile({
      currentEmail: session.email,
      name,
      email,
      password: password || undefined,
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onSaved(result.session);
  };

  return (
    <main className="bw-page fade-in">
      <ScreenHeader title="Edit Profile" onBack={onBack} />
      <form onSubmit={submit} className="bw-pad-x flex flex-1 flex-col pb-10 pt-2">
        <p className="bw-body">Update your name, email, or password.</p>

        <div className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-sm font-medium">
              Name
            </Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="edit-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-password" className="text-sm font-medium">
              New password
            </Label>
            <Input
              id="edit-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
              autoComplete="new-password"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm font-medium text-red-800" role="alert">
            {error}
          </p>
        )}

        <div className="mt-auto pt-12">
          <Button type="submit" size="lg" className="w-full">
            Save changes
          </Button>
        </div>
      </form>
    </main>
  );
}
