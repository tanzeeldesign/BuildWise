import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "../auth";
import type { Session } from "../types";
import { ScreenHeader } from "./ScreenHeader";

type SignInProps = {
  onBack: () => void;
  onSuccess: (session: Session) => void;
  onGoSignUp: () => void;
};

export function SignIn({ onBack, onSuccess, onGoSignUp }: SignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const result = signIn({ email, password });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onSuccess(result.session);
  };

  return (
    <main className="bw-page fade-in">
      <ScreenHeader title="Sign In" onBack={onBack} />
      <form onSubmit={submit} className="bw-pad-x flex flex-1 flex-col pb-10 pt-2">
        <p className="bw-body">Enter your details to sign in.</p>

        <div className="mt-8 space-y-5">
          <div className="space-y-2">
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
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              autoComplete="current-password"
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
            Sign In
          </Button>
          <p className="text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={onGoSignUp}
              className="font-bold text-foreground underline-offset-2 hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </form>
    </main>
  );
}
