import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScreenHeader } from "./ScreenHeader";

type NamePlanProps = {
  onBack: () => void;
  onConfirm: (name: string) => void;
};

export function NamePlan({ onBack, onConfirm }: NamePlanProps) {
  const inputId = useId();
  const [name, setName] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onConfirm(name.trim());
  };

  return (
    <main className="bw-page fade-in">
      <ScreenHeader title="New plan" onBack={onBack} />
      <form onSubmit={submit} className="bw-pad-x flex flex-1 flex-col pb-10 pt-2">
        <h1 className="bw-title">Name your plan</h1>
        <p className="bw-body mt-3">
          Give this project a label you will recognize later — a city, plot, or nickname.
        </p>

        <div className="mt-8 flex flex-col gap-3.5">
          <Label htmlFor={inputId} className="text-sm font-medium">
            Plan name
          </Label>
          <Input
            id={inputId}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Lahore plot, Beach house"
            autoFocus
            autoComplete="off"
            maxLength={60}
          />
        </div>

        <div className="mt-auto flex flex-col gap-3 pt-12">
          <Button type="submit" size="lg" className="w-full" disabled={!name.trim()}>
            Continue
          </Button>
          <Button type="button" variant="ghost" size="lg" className="w-full" onClick={onBack}>
            Cancel
          </Button>
        </div>
      </form>
    </main>
  );
}
