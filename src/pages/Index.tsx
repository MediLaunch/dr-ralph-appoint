import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import { AppointmentCalender, EnquiryForm, MedosClient } from "medos-sdk";
import { ComponentType } from "react";
const AppointmentCalenderComponent =
  AppointmentCalender as unknown as ComponentType<{
    onError?: (err: Error) => void;
  }>;

MedosClient.init({
  apiKey: "mk_8c95a5579c64c00958c269bb3d25d3e18c95a5579c64c00958c269bb3d25d3e1",
});
const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <div className="xl:px-72 px-10 ">
        <AppointmentCalenderComponent
          onError={(err) => {
            console.log(err);
          }}
        />
      </div>
      <div className="xl:px-72 px-10 ">
        <EnquiryForm />
      </div>
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
