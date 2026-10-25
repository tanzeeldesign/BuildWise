import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { emptyAnswers, hasCompletedPlan } from "@/features/buildwise/answers";
import {
  loadSession,
  markSplashSeen,
  signOut,
  splashSeenThisSession,
} from "@/features/buildwise/auth";
import { ChoosePlan } from "@/features/buildwise/components/ChoosePlan";
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
import { EditProfile } from "@/features/buildwise/components/EditProfile";
import { Profile } from "@/features/buildwise/components/Profile";
import { SignIn } from "@/features/buildwise/components/SignIn";
import { SignUp } from "@/features/buildwise/components/SignUp";
import { Splash } from "@/features/buildwise/components/Splash";
import {
  addPlan,
  completedCount,
  createEmptyPlan,
  getActivePlan,
  getHomeFocusPlan,
  getPlan,
  isTopicComplete,
  loadPlansStore,
  planProgress,
  removePlan,
  savePlansStore,
  setActivePlanId,
  toggleTopicComplete,
  upsertPlanAnswers,
} from "@/features/buildwise/plans";
import { buildPlan } from "@/features/buildwise/recommendations";
import {
  loadSubscription,
  migrateSubscriptionEmail,
  saveSubscription,
} from "@/features/buildwise/subscription";
import type {
  Answers,
  PlanTabMode,
  PlansStore,
  Session,
  SubscriptionId,
  SubscriptionRecord,
  Tab,
  TopicId,
  View,
} from "@/features/buildwise/types";
import { TOTAL_STEPS } from "@/features/buildwise/questions";

function initialView(): View {
  if (typeof window === "undefined") return "splash";
  const session = loadSession();
  if (session) {
    return loadSubscription(session.email) ? "home" : "choose-plan";
  }
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
const STACK_VIEWS: View[] = [
  "planner",
  "processing",
  "guide",
  "final-plan",
  "disclaimer",
  "choose-plan",
  "edit-profile",
];

function firstIncompleteStep(answers: Answers): number {
  const keys = [
    "project",
    "location",
    "plot",
    "climate",
    "family",
    "outdoor",
    "future",
    "style",
    "priorities",
  ] as const;
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i]!;
    if (key === "priorities" || key === "climate") {
      if (!answers[key]?.length) return i;
    } else if (!answers[key]?.trim()) {
      return i;
    }
  }
  return 0;
}

function BuildWise() {
  const [view, setView] = useState<View>(initialView);
  const [tab, setTab] = useState<Tab>("home");
  const [session, setSession] = useState<Session | null>(() => loadSession());
  const [store, setStoreState] = useState<PlansStore>(() => loadPlansStore());
  const [planMode, setPlanMode] = useState<PlanTabMode>("list");
  const [step, setStep] = useState(0);
  const [topicId, setTopicId] = useState<TopicId>("ventilation");
  const [stackReturn, setStackReturn] = useState<Tab>("plan");
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionRecord | null>(() => {
    const s = loadSession();
    return s ? loadSubscription(s.email) : null;
  });
  const [planChooserMode, setPlanChooserMode] = useState<"onboarding" | "settings">(
    "onboarding",
  );

  const updateStore = useCallback((recipe: (prev: PlansStore) => PlansStore) => {
    setStoreState((prev) => {
      const next = recipe(prev);
      savePlansStore(next);
      return next;
    });
  }, []);

  const activePlan = useMemo(() => getActivePlan(store), [store]);
  const focusPlan = useMemo(() => getHomeFocusPlan(store), [store]);
  const editingPlan = useMemo(
    () => getPlan(store, editingPlanId) ?? activePlan,
    [store, editingPlanId, activePlan],
  );
  const answers = editingPlan?.answers ?? emptyAnswers;
  const built = useMemo(
    () => (activePlan && hasCompletedPlan(activePlan.answers) ? buildPlan(activePlan.answers) : null),
    [activePlan],
  );
  const guideBuilt = useMemo(() => buildPlan(activePlan?.answers ?? emptyAnswers), [activePlan]);
  const readyCount = useMemo(() => completedCount(store), [store]);

  const setAnswers = useCallback(
    (next: Answers) => {
      updateStore((prev) => {
        const planId = editingPlanId ?? prev.activePlanId;
        if (!planId) return prev;
        return upsertPlanAnswers(prev, planId, next);
      });
    },
    [editingPlanId, updateStore],
  );

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
    if (next === "plan") setPlanMode("list");
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

  const openPlanDetail = useCallback(
    (planId: string) => {
      updateStore((prev) => setActivePlanId(prev, planId));
      setPlanMode("detail");
      setTab("plan");
      setView("plan");
      requestAnimationFrame(scrollTop);
    },
    [updateStore],
  );

  const startNewPlan = useCallback(
    (from: Tab = "home", name?: string) => {
      const trimmed = name?.trim();
      const plan = createEmptyPlan(
        trimmed ? { name: trimmed, nameIsCustom: true } : undefined,
      );
      updateStore((prev) => addPlan(prev, plan));
      setEditingPlanId(plan.id);
      setStep(0);
      setPlanMode("list");
      openStack("planner", from);
    },
    [openStack, updateStore],
  );

  const continuePlan = useCallback(
    (planId: string, from: Tab = "home") => {
      const plan = getPlan(store, planId);
      if (!plan) return;
      updateStore((prev) => setActivePlanId(prev, planId));
      setEditingPlanId(planId);
      setStep(firstIncompleteStep(plan.answers));
      openStack("planner", from);
    },
    [openStack, store, updateStore],
  );

  const editPlanAnswers = useCallback(
    (planId: string, from: Tab = "plan") => {
      const plan = getPlan(store, planId);
      if (!plan) return;
      updateStore((prev) => setActivePlanId(prev, planId));
      setEditingPlanId(planId);
      setStep(0);
      openStack("planner", from);
    },
    [openStack, store, updateStore],
  );

  const deletePlan = useCallback(
    (planId: string) => {
      const plan = getPlan(store, planId);
      if (!plan) return;
      const label = plan.name;
      if (
        typeof window !== "undefined" &&
        !window.confirm(`Delete “${label}”? This can’t be undone.`)
      ) {
        return;
      }
      updateStore((prev) => {
        const next = removePlan(prev, planId);
        setEditingPlanId((current) => (current === planId ? next.activePlanId : current));
        return next;
      });
      setPlanMode("list");
      requestAnimationFrame(scrollTop);
    },
    [store, updateStore],
  );

  const openPlanChooser = useCallback(
    (mode: "onboarding" | "settings", from: Tab = "profile") => {
      setPlanChooserMode(mode);
      if (mode === "settings") {
        openStack("choose-plan", from);
      } else {
        go("choose-plan");
      }
    },
    [go, openStack],
  );

  const applySubscription = useCallback(
    (tierId: SubscriptionId) => {
      if (!session) return;
      const record = saveSubscription(session.email, tierId);
      setSubscription(record);
      if (planChooserMode === "settings") {
        closeStack();
      } else {
        go("home");
      }
    },
    [closeStack, go, planChooserMode, session],
  );

  const onAuthSuccess = useCallback(
    (next: Session) => {
      setSession(next);
      const existing = loadSubscription(next.email);
      setSubscription(existing);
      if (existing) {
        go("home");
      } else {
        setPlanChooserMode("onboarding");
        go("choose-plan");
      }
    },
    [go],
  );

  const onSignOut = useCallback(() => {
    signOut();
    setSession(null);
    setSubscription(null);
    go("get-started");
  }, [go]);

  const finishSplash = useCallback(() => {
    markSplashSeen();
    go("get-started");
  }, [go]);

  const showTabs =
    Boolean(session) && TAB_VIEWS.includes(view as Tab) && !STACK_VIEWS.includes(view);

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
        step={Math.min(step, TOTAL_STEPS - 1)}
        setStep={setStep}
        answers={answers}
        setAnswers={setAnswers}
        onExit={closeStack}
        onDone={() => {
          if (editingPlanId) {
            updateStore((prev) => setActivePlanId(prev, editingPlanId));
          }
          openStack("processing", stackReturn);
        }}
      />
    );
  } else if (view === "processing") {
    content = (
      <Processing
        onDone={() => {
          setPlanMode("detail");
          setTab("plan");
          openGuide(guideBuilt.topTopicId, "plan");
        }}
      />
    );
  } else if (view === "guide") {
    const guideProgress = activePlan ? planProgress(activePlan) : null;
    content = (
      <Guide
        answers={activePlan?.answers ?? emptyAnswers}
        plan={guideBuilt}
        topicId={topicId}
        isComplete={activePlan ? isTopicComplete(activePlan, topicId) : false}
        guidesDone={guideProgress?.guidesDone ?? 0}
        guidesTotal={guideProgress?.guidesTotal ?? 6}
        onToggleComplete={() => {
          if (!activePlan) return;
          updateStore((prev) => toggleTopicComplete(prev, activePlan.id, topicId));
        }}
        onBack={closeStack}
        openGuide={(id) => {
          setTopicId(id);
          requestAnimationFrame(scrollTop);
        }}
      />
    );
  } else if (view === "final-plan") {
    content = built ? (
      <FinalPlan
        plan={built}
        onBack={closeStack}
        onDisclaimer={() => openStack("disclaimer", stackReturn)}
      />
    ) : (
      <Disclaimer onBack={closeStack} />
    );
  } else if (view === "disclaimer") {
    content = <Disclaimer onBack={closeStack} />;
  } else if (view === "edit-profile" && session) {
    content = (
      <EditProfile
        session={session}
        onBack={closeStack}
        onSaved={(next) => {
          if (next.email !== session.email) {
            migrateSubscriptionEmail(session.email, next.email);
          }
          setSession(next);
          setSubscription(loadSubscription(next.email));
          closeStack();
        }}
      />
    );
  } else if (view === "choose-plan") {
    content = (
      <ChoosePlan
        mode={planChooserMode}
        current={subscription}
        onSelect={applySubscription}
        {...(planChooserMode === "settings" ? { onBack: closeStack } : {})}
        {...(planChooserMode === "onboarding"
          ? { onSkipFree: () => applySubscription("free") }
          : {})}
      />
    );
  } else if (view === "plan") {
    content = (
      <PlanHub
        mode={planMode}
        plans={store.plans}
        activePlan={activePlan}
        built={built}
        onOpenPlan={openPlanDetail}
        onBackToList={() => {
          setPlanMode("list");
          requestAnimationFrame(scrollTop);
        }}
        onStartNewPlan={(name) => startNewPlan("plan", name)}
        onContinuePlan={(id) => continuePlan(id, "plan")}
        onEditAnswers={(id) => editPlanAnswers(id, "plan")}
        onDeletePlan={deletePlan}
        onOpenGuide={(id) => openGuide(id, "plan")}
        onOpenFinalPlan={() => openStack("final-plan", "plan")}
      />
    );
  } else if (view === "profile") {
    content = (
      <Profile
        session={session}
        subscription={subscription}
        onManageSubscription={() => openPlanChooser("settings", "profile")}
        onEditProfile={() => openStack("edit-profile", "profile")}
        onDisclaimer={() => openStack("disclaimer", "profile")}
        onSignOut={onSignOut}
      />
    );
  } else {
    content = (
      <Home
        session={session}
        focusPlan={focusPlan}
        planCount={store.plans.length}
        completedCount={readyCount}
        onOpenPlan={openPlanDetail}
        onContinuePlan={(id) => continuePlan(id, "home")}
        onStartNewPlan={(name) => startNewPlan("home", name)}
        onBrowsePlans={() => goTab("plan")}
      />
    );
  }

  return (
    <PhoneShell
      scrollable={view !== "profile"}
      gridBackground={
        view === "home" || view === "plan" || view === "profile" || view === "guide"
      }
      footer={showTabs ? <MobileTabBar active={tab} onChange={goTab} /> : undefined}
    >
      {content}
    </PhoneShell>
  );
}
