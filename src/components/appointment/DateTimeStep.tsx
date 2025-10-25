import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AppointmentData } from "./AppointmentForm";

interface DateTimeStepProps {
  formData: AppointmentData;
  updateFormData: (data: Partial<AppointmentData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
];

const DateTimeStep = ({ formData, updateFormData, onNext, onBack }: DateTimeStepProps) => {
  const isValid = formData.date && formData.time;
  const selectedDate = formData.date ? new Date(formData.date) : undefined;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <Label className="text-base font-semibold flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-primary" />
          Select Date
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => updateFormData({ date: date?.toISOString() || "" })}
              disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="time" className="text-base font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Select Time
        </Label>
        <Select value={formData.time} onValueChange={(value) => updateFormData({ time: value })}>
          <SelectTrigger id="time" className="w-full">
            <SelectValue placeholder="Choose appointment time" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50 max-h-[300px]">
            {timeSlots.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between pt-4 gap-4">
        <Button onClick={onBack} variant="outline" size="lg" className="w-full sm:w-auto">
          Back
        </Button>
        <Button onClick={onNext} disabled={!isValid} size="lg" className="w-full sm:w-auto">
          Continue to Details
        </Button>
      </div>
    </div>
  );
};

export default DateTimeStep;
