import { CheckCircle2, Circle } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { number: 1, title: "Location & Doctor" },
  { number: 2, title: "Date & Time" },
  { number: 3, title: "Your Details" },
];

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              <div className="flex flex-col items-center">
                {currentStep > step.number ? (
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                ) : (
                  <Circle
                    className={`w-8 h-8 ${
                      currentStep === step.number ? "text-primary fill-primary" : "text-muted-foreground"
                    }`}
                  />
                )}
                <span
                  className={`text-sm mt-2 font-medium ${
                    currentStep >= step.number ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 rounded ${
                    currentStep > step.number ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
