import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import StepIndicator from "./StepIndicator";
import LocationDoctorStep from "./LocationDoctorStep";
import DateTimeStep from "./DateTimeStep";
import PatientDetailsStep from "./PatientDetailsStep";

export interface AppointmentData {
  location: string;
  doctor: string;
  date: string;
  time: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
}

const AppointmentForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<AppointmentData>({
    location: "",
    doctor: "",
    date: "",
    time: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  });

  const updateFormData = (data: Partial<AppointmentData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    console.log("=== APPOINTMENT BOOKING DATA ===");
    console.log("Location:", formData.location);
    console.log("Doctor:", formData.doctor);
    console.log("Date:", formData.date);
    console.log("Time:", formData.time);
    console.log("Patient First Name:", formData.firstName);
    console.log("Patient Last Name:", formData.lastName);
    console.log("Patient Email:", formData.email);
    console.log("Patient Phone:", formData.phone);
    console.log("Notes:", formData.notes);
    console.log("================================");
    console.log("Full Data Object:", formData);
  };

  return (
    <section id="appointment-form" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-foreground mb-4">Book an Appointment</h2>
            <p className="text-muted-foreground text-lg">
              Schedule your visit in just a few simple steps
            </p>
          </div>

          <Card className="border-border shadow-lg">
            <CardHeader>
              <StepIndicator currentStep={currentStep} />
            </CardHeader>
            <CardContent className="p-6">
              {currentStep === 1 && (
                <LocationDoctorStep
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={handleNext}
                />
              )}
              {currentStep === 2 && (
                <DateTimeStep
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              {currentStep === 3 && (
                <PatientDetailsStep
                  formData={formData}
                  updateFormData={updateFormData}
                  onSubmit={handleSubmit}
                  onBack={handleBack}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AppointmentForm;
