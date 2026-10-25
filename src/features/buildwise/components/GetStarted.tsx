import { ArrowRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import homeImage from "@/assets/buildwise-home.jpg";

type GetStartedProps = {
  onLetsBuild: () => void;
  onSignIn: () => void;
};

export function GetStarted({ onLetsBuild, onSignIn }: GetStartedProps) {
  return (
    <main className="bw-page">
      <div className="relative h-[240px] shrink-0 overflow-hidden">
        <img
          src={homeImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background from-[12%] via-background/55 to-transparent" />
      </div>

      <div className="bw-pad-x flex flex-1 flex-col pb-10 pt-1">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl border border-primary/35 bg-card text-primary shadow-sm">
            <Leaf className="size-4" strokeWidth={2} />
          </span>
          <span className="text-[17px] font-bold tracking-tight">BuildWise</span>
        </div>

        <h1 className="bw-title mt-7">
          Build smarter.
          <br />
          Before you build.
        </h1>
        <p className="bw-body mt-4 max-w-[32ch]">
          Plan around climate and lifestyle, then share a guide with your architect.
        </p>

        <div className="bw-cta mt-auto gap-3 pt-12">
          <Button size="lg" className="w-full" onClick={onLetsBuild}>
            Let’s Build <ArrowRight />
          </Button>
          <Button variant="outline" size="lg" className="w-full" onClick={onSignIn}>
            I already have an account
          </Button>
        </div>
      </div>
    </main>
  );
}
