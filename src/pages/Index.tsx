import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";

import {
  AppointmentCalender,
  defaultTheme,
  EnquiryForm,
  MedosClient,
  MedosThemeProvider,
} from "medos-sdk";

MedosClient.init({
  apiKey: "mk_8c95a5579c64c00958c269bb3d25d3e18c95a5579c64c00958c269bb3d25d3e1",
});

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ServicesSection />
      <AboutSection />

      {/* SDK Components wrapped in MedosThemeProvider */}
      <MedosThemeProvider theme={defaultTheme}>
        <div className="xl:px-72 px-10">
          <AppointmentCalender
            onError={(err) => {
              console.log(err);
            }}
          />
        </div>

        <div className="xl:px-72 px-10 mt-12">
          <EnquiryForm />
        </div>
      </MedosThemeProvider>

      <footer className="bg-primary text-primary-foreground py-8 mt-12">
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
