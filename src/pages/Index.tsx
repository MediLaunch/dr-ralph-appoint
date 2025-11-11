import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import AppointmentCalender from "medos-sdk-react";
import { ComponentType } from "react";
const AppointmentCalenderComponent =
  AppointmentCalender as unknown as ComponentType<{
    apiKey: string;
    onError?: (err: Error) => void;
  }>;
const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <AppointmentCalenderComponent
        apiKey="HIII"
        onError={(err) => {
          console.log(err);
        }}
      />
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © 2025 Dr. Ralph's Clinic. All rights reserved.
          </p>
          <p className="text-xs mt-2 opacity-80">
            Providing quality healthcare with compassion
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
