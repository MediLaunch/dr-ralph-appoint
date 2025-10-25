import { useRef } from "react";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import AppointmentForm from "@/components/appointment/AppointmentForm";

const Index = () => {
  const appointmentRef = useRef<HTMLDivElement>(null);

  const scrollToAppointment = () => {
    appointmentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <HeroSection onBookAppointment={scrollToAppointment} />
      <ServicesSection />
      <AboutSection />
      <div ref={appointmentRef}>
        <AppointmentForm />
      </div>
      
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2025 Dr. Ralph's Clinic. All rights reserved.</p>
          <p className="text-xs mt-2 opacity-80">Providing quality healthcare with compassion</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
