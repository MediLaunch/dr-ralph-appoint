import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppointmentData } from "./AppointmentForm";
import { MapPin, UserRound } from "lucide-react";

interface LocationDoctorStepProps {
  formData: AppointmentData;
  updateFormData: (data: Partial<AppointmentData>) => void;
  onNext: () => void;
}

const locations = [
  { value: "downtown", label: "Downtown Clinic - 123 Main St" },
  { value: "westside", label: "Westside Medical Center - 456 Oak Ave" },
  { value: "northgate", label: "Northgate Health - 789 Elm Rd" },
];

const doctors = [
  { value: "dr-ralph", label: "Dr. Ralph Johnson - Family Medicine" },
  { value: "dr-smith", label: "Dr. Sarah Smith - Internal Medicine" },
  { value: "dr-chen", label: "Dr. Michael Chen - Pediatrics" },
];

const LocationDoctorStep = ({ formData, updateFormData, onNext }: LocationDoctorStepProps) => {
  const isValid = formData.location && formData.doctor;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="location" className="text-base font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Select Location
        </Label>
        <Select value={formData.location} onValueChange={(value) => updateFormData({ location: value })}>
          <SelectTrigger id="location" className="w-full">
            <SelectValue placeholder="Choose a clinic location" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            {locations.map((location) => (
              <SelectItem key={location.value} value={location.value}>
                {location.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="doctor" className="text-base font-semibold flex items-center gap-2">
          <UserRound className="w-4 h-4 text-primary" />
          Select Doctor
        </Label>
        <Select value={formData.doctor} onValueChange={(value) => updateFormData({ doctor: value })}>
          <SelectTrigger id="doctor" className="w-full">
            <SelectValue placeholder="Choose your preferred doctor" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            {doctors.map((doctor) => (
              <SelectItem key={doctor.value} value={doctor.value}>
                {doctor.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={onNext} disabled={!isValid} size="lg" className="w-full sm:w-auto">
          Continue to Date & Time
        </Button>
      </div>
    </div>
  );
};

export default LocationDoctorStep;
