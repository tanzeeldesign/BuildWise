import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
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
    <main className="flex h-full min-h-full flex-1 flex-col bg-background">
      <ScreenHeader title="Sign in" onBack={onBack} />
      <form onSubmit={submit} className="flex flex-1 flex-col px-5 pb-8 pt-6">
        <p className="text-sm text-muted-foreground">Welcome back. Use the account you created on this device.</p>
        <div className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
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
            <Label htmlFor="password">Password</Label>
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
        {error && <p className="mt-4 text-sm font-medium text-red-800">{error}</p>}
        <div className="mt-auto flex flex-col gap-3 pt-10">
          <Button type="submit" size="lg" className="w-full">
            Sign in <ArrowRight />
          </Button>
          <Button type="button" variant="ghost" size="lg" className="w-full" onClick={onGoSignUp}>
            Need an account? Sign up
          </Button>
        </div>
      </form>
    </main>
  );
}
