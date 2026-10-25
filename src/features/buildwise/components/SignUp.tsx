import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "../auth";
import type { Session } from "../types";
import { ScreenHeader } from "./ScreenHeader";

type SignUpProps = {
  onBack: () => void;
  onSuccess: (session: Session) => void;
  onGoSignIn: () => void;
};

export function SignUp({ onBack, onSuccess, onGoSignIn }: SignUpProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const result = signUp({ name, email, password });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onSuccess(result.session);
  };

  return (
    <main className="bw-page fade-in">
      <ScreenHeader title="Create Account" onBack={onBack} />
      <form onSubmit={submit} className="bw-pad-x flex flex-1 flex-col pb-10 pt-2">
        <p className="bw-body">Enter your details to get started.</p>

        <div className="mt-8 space-y-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 4 characters"
              autoComplete="new-password"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm font-medium text-red-800" role="alert">
            {error}
          </p>
        )}

        <div className="mt-auto flex flex-col items-center gap-5 pt-12">
          <Button type="submit" size="lg" className="w-full">
            Sign up
          </Button>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onGoSignIn}
              className="font-bold text-foreground underline-offset-2 hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </main>
  );
}
