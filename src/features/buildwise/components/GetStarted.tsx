import { ArrowRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import homeImage from "@/assets/buildwise-home.jpg";

type GetStartedProps = {
  onLetsBuild: () => void;
  onSignIn: () => void;
};

export function GetStarted({ onLetsBuild, onSignIn }: GetStartedProps) {
  return (
    <main className="flex h-full min-h-full flex-1 flex-col bg-background">
      <div className="relative h-56 shrink-0 overflow-hidden">
        <img src={homeImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col px-5 pb-8 pt-2">
        <div className="flex items-center gap-2 text-base font-bold">
          <span className="grid size-8 place-items-center border border-primary text-primary">
            <Leaf className="size-3.5" />
          </span>
          BuildWise
        </div>
        <h1 className="mt-6 text-balance text-3xl font-semibold leading-tight">
          Build smarter.
          <br />
          Before you build.
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Plan your home around climate, lifestyle and future needs — then share a clear guide with your architect.
        </p>
        <div className="mt-auto flex flex-col gap-3 pt-10">
          <Button size="lg" className="w-full" onClick={onLetsBuild}>
            Let’s build <ArrowRight />
          </Button>
          <Button variant="ghost" size="lg" className="w-full" onClick={onSignIn}>
            I already have an account
          </Button>
        </div>
      </div>
    </main>
  );
}
