import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AppointmentData } from "./AppointmentForm";
import { User, Mail, Phone, FileText } from "lucide-react";
import { toast } from "sonner";

interface PatientDetailsStepProps {
  formData: AppointmentData;
  updateFormData: (data: Partial<AppointmentData>) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const PatientDetailsStep = ({ formData, updateFormData, onSubmit, onBack }: PatientDetailsStepProps) => {
  const isValid = formData.firstName && formData.lastName && formData.email && formData.phone;

  const handleSubmit = () => {
    onSubmit();
    toast.success("Appointment booked successfully!", {
      description: "Check console for appointment details"
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-base font-semibold flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            First Name
          </Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => updateFormData({ firstName: e.target.value })}
            placeholder="John"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-base font-semibold">
            Last Name
          </Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => updateFormData({ lastName: e.target.value })}
            placeholder="Doe"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-base font-semibold flex items-center gap-2">
          <Mail className="w-4 h-4 text-primary" />
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          placeholder="john.doe@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-base font-semibold flex items-center gap-2">
          <Phone className="w-4 h-4 text-primary" />
          Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => updateFormData({ phone: e.target.value })}
          placeholder="(555) 123-4567"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-base font-semibold flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          Additional Notes (Optional)
        </Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => updateFormData({ notes: e.target.value })}
          placeholder="Any specific concerns or information we should know..."
          className="min-h-[100px]"
        />
      </div>

      <div className="flex justify-between pt-4 gap-4">
        <Button onClick={onBack} variant="outline" size="lg" className="w-full sm:w-auto">
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={!isValid} size="lg" className="w-full sm:w-auto">
          Book Appointment
        </Button>
      </div>
    </div>
  );
};

export default PatientDetailsStep;
