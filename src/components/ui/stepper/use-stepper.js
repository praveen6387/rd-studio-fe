import * as React from "react";
import { StepperContext } from "./context";

function usePrevious(value) {
  const ref = React.useRef();

  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export function useStepper() {
  const context = React.useContext(StepperContext);

  if (context === undefined) {
    throw new Error("useStepper must be used within a StepperProvider");
  }

  const { setStep, ...rest } = context; // Changed to setStep

  const isLastStep = context.activeStep === context.steps.length - 1;
  const hasCompletedAllSteps = context.activeStep === context.steps.length;

  const previousActiveStep = usePrevious(context.activeStep);

  const currentStep = context.steps[context.activeStep];
  const isOptionalStep = !!currentStep?.optional;

  const isDisabledStep = context.activeStep === 0;

  return {
    ...rest,
    setStep, // Changed to setStep
    isLastStep,
    hasCompletedAllSteps,
    isOptionalStep,
    isDisabledStep,
    currentStep,
    previousActiveStep,
  };
}
