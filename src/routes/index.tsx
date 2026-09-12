import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { hasCompletedPlan, loadAnswers, saveAnswers } from "@/features/buildwise/answers";
import {
  loadSession,
  markSplashSeen,
  signOut,
  splashSeenThisSession,
} from "@/features/buildwise/auth";
import { Disclaimer } from "@/features/buildwise/components/Disclaimer";
import { FinalPlan } from "@/features/buildwise/components/FinalPlan";
import { GetStarted } from "@/features/buildwise/components/GetStarted";
import { Guide } from "@/features/buildwise/components/Guide";
import { Home } from "@/features/buildwise/components/Home";
import { MobileTabBar } from "@/features/buildwise/components/MobileTabBar";
import { PhoneShell } from "@/features/buildwise/components/PhoneShell";
import { PlanHub } from "@/features/buildwise/components/PlanHub";
import { Planner } from "@/features/buildwise/components/Planner";
import { Processing } from "@/features/buildwise/components/Processing";
import { Profile } from "@/features/buildwise/components/Profile";
import { SignIn } from "@/features/buildwise/components/SignIn";
import { SignUp } from "@/features/buildwise/components/SignUp";
import { Splash } from "@/features/buildwise/components/Splash";
import { buildPlan } from "@/features/buildwise/recommendations";
import type { Answers, Session, Tab, TopicId, View } from "@/features/buildwise/types";

function initialView(): View {
  if (typeof window === "undefined") return "splash";
  if (loadSession()) return "home";
  if (splashSeenThisSession()) return "get-started";
  return "splash";
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BuildWise | Smarter Home Planning" },
      {
        name: "description",
        content: "Plan a smarter home around your location, climate, lifestyle and future needs.",
      },
      { property: "og:title", content: "BuildWise | Smarter Home Planning" },
      {
        property: "og:description",
        content: "A personalized planning guide for a more comfortable, considered home.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BuildWise,
});

const TAB_VIEWS: Tab[] = ["home", "plan", "profile"];
const STACK_VIEWS: View[] = ["planner", "processing", "guide", "final-plan", "disclaimer"];

function BuildWise() {
  const [view, setView] = useState<View>(initialView);
  const [tab, setTab] = useState<Tab>("home");
  const [session, setSession] = useState<Session | null>(() => loadSession());
  const [step, setStep] = useState(0);
  const [answers, setAnswersState] = useState<Answers>(() => loadAnswers());
  const [topicId, setTopicId] = useState<TopicId>("ventilation");
  const [stackReturn, setStackReturn] = useState<Tab>("plan");

  const setAnswers = useCallback((next: Answers) => {
    setAnswersState(next);
    saveAnswers(next);
  }, []);

  const plan = useMemo(() => buildPlan(answers), [answers]);
  const completed = hasCompletedPlan(answers);

  const scrollTop = () => {
    const scroller = document.querySelector("[data-phone-scroll]");
    if (scroller instanceof HTMLElement) scroller.scrollTo({ top: 0, behavior: "smooth" });
  };

  const go = useCallback((next: View) => {
    setView(next);
    if (TAB_VIEWS.includes(next as Tab)) setTab(next as Tab);
    requestAnimationFrame(scrollTop);
  }, []);

  const goTab = useCallback((next: Tab) => {
    setTab(next);
    setView(next);
    requestAnimationFrame(scrollTop);
  }, []);

  const openStack = useCallback((next: View, from: Tab = "plan") => {
    setStackReturn(from);
    setView(next);
    requestAnimationFrame(scrollTop);
  }, []);

  const closeStack = useCallback(() => {
    setView(stackReturn);
    setTab(stackReturn);
    requestAnimationFrame(scrollTop);
  }, [stackReturn]);

  const openGuide = useCallback(
    (id: TopicId, from: Tab = "plan") => {
      setTopicId(id);
      openStack("guide", from);
    },
    [openStack],
  );

  const startPlanner = useCallback(
    (from: Tab = "home") => {
      setStep(0);
      openStack("planner", from);
    },
    [openStack],
  );

  const onAuthSuccess = useCallback(
    (next: Session) => {
      setSession(next);
      go("home");
    },
    [go],
  );

  const onSignOut = useCallback(() => {
    signOut();
    setSession(null);
    go("get-started");
  }, [go]);

  const finishSplash = useCallback(() => {
    markSplashSeen();
    go("get-started");
  }, [go]);

  const showTabs = Boolean(session) && TAB_VIEWS.includes(view as Tab) && !STACK_VIEWS.includes(view);

  let content: ReactNode = null;

  if (view === "splash") content = <Splash onContinue={finishSplash} />;
  else if (view === "get-started") {
    content = (
      <GetStarted onLetsBuild={() => go("sign-up")} onSignIn={() => go("sign-in")} />
    );
  } else if (view === "sign-up") {
    content = (
      <SignUp
        onBack={() => go("get-started")}
        onSuccess={onAuthSuccess}
        onGoSignIn={() => go("sign-in")}
      />
    );
  } else if (view === "sign-in") {
    content = (
      <SignIn
        onBack={() => go("get-started")}
        onSuccess={onAuthSuccess}
        onGoSignUp={() => go("sign-up")}
      />
    );
  } else if (!session) {
    content = <GetStarted onLetsBuild={() => go("sign-up")} onSignIn={() => go("sign-in")} />;
  } else if (view === "planner") {
    content = (
      <Planner
        step={step}
        setStep={setStep}
        answers={answers}
        setAnswers={setAnswers}
        onExit={closeStack}
        onDone={() => openStack("processing", stackReturn)}
      />
    );
  } else if (view === "processing") {
    content = (
      <Processing
        onDone={() => {
          setTab("plan");
          go("plan");
        }}
      />
    );
  } else if (view === "guide") {
    content = (
      <Guide
        answers={answers}
        plan={plan}
        topicId={topicId}
        onBack={closeStack}
        openGuide={(id) => {
          setTopicId(id);
          requestAnimationFrame(scrollTop);
        }}
      />
    );
  } else if (view === "final-plan") {
    content = (
      <FinalPlan
        plan={plan}
        onBack={closeStack}
        onDisclaimer={() => openStack("disclaimer", stackReturn)}
      />
    );
  } else if (view === "disclaimer") {
    content = <Disclaimer onBack={closeStack} />;
  } else if (view === "plan") {
    content = (
      <PlanHub
        plan={plan}
        hasPlan={completed}
        onStartPlanning={() => startPlanner("plan")}
        onOpenGuide={(id) => openGuide(id, "plan")}
        onOpenFinalPlan={() => openStack("final-plan", "plan")}
      />
    );
  } else if (view === "profile") {
    content = (
      <Profile
        session={session}
        plan={plan}
        hasPlan={completed}
        onEdit={() => startPlanner("profile")}
        onStartPlanning={() => startPlanner("profile")}
        onDisclaimer={() => openStack("disclaimer", "profile")}
        onSignOut={onSignOut}
      />
    );
  } else {
    content = (
      <Home
        session={session}
        plan={plan}
        hasPlan={completed}
        onStartPlanning={() => startPlanner("home")}
        onOpenPlan={() => goTab("plan")}
        onOpenGuide={(id) => openGuide(id, "home")}
      />
    );
  }

  return (
    <PhoneShell footer={showTabs ? <MobileTabBar active={tab} onChange={goTab} /> : undefined}>
      {content}
    </PhoneShell>
  );
}
