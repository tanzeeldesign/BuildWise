import { useState } from "react";
import type { SubscriptionId, SubscriptionRecord } from "../types";
import { ChoosePlan } from "./ChoosePlan";
import { NamePlan } from "./NamePlan";

type CreatePlanFlowProps = {
  subscription: SubscriptionRecord | null;
  onBack: () => void;
  onSelectTier: (tierId: SubscriptionId) => void;
  onConfirmName: (name: string) => void;
};

export function CreatePlanFlow({
  subscription,
  onBack,
  onSelectTier,
  onConfirmName,
}: CreatePlanFlowProps) {
  const [step, setStep] = useState<"choose" | "name">("choose");

  if (step === "choose") {
    return (
      <ChoosePlan
        mode="onboarding"
        current={subscription}
        onBack={onBack}
        onSelect={(tierId) => {
          onSelectTier(tierId);
          setStep("name");
        }}
        onSkipFree={() => {
          onSelectTier("free");
          setStep("name");
        }}
      />
    );
  }

  return (
    <NamePlan
      onBack={() => setStep("choose")}
      onConfirm={onConfirmName}
    />
  );
}
