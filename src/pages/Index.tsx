import { useEffect, useRef } from "react";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";

// Extend window to include MedOS SDK types
declare global {
  interface Window {
    MedosAppointment?: {
      init: (options: {
        containerId: string;
        apiKey: string;
        mode?: "modal" | "inline";
        onError?: (error: Error) => void;
        onSuccess?: () => void;
      }) => void;
    };
    MedosEnquiry?: {
      init: (options: {
        containerId: string;
        apiKey: string;
        mode?: "modal" | "inline";
        onError?: (error: Error) => void;
        onSuccess?: () => void;
      }) => void;
    };
  }
}

const API_KEY =
  "mk_bf42d16d3fd0c7756dfa3b783061df98bf42d16d3fd0c7756dfa3b783061df98";

const Index = () => {
  const appointmentContainerRef = useRef<HTMLDivElement>(null);
  const enquiryContainerRef = useRef<HTMLDivElement>(null);
  const appointmentInitialized = useRef(false);
  const enquiryInitialized = useRef(false);

  useEffect(() => {
    // Initialize both widgets
    const initWidgets = () => {
      // Initialize Appointment Calendar
      if (
        window.MedosAppointment &&
        appointmentContainerRef.current &&
        !appointmentInitialized.current
      ) {
        window.MedosAppointment.init({
          containerId: "index-appointment-widget",
          apiKey: API_KEY,
          mode: "inline",
          onError: (err) => {
            console.error("Appointment error:", err);
          },
          onSuccess: () => {
            console.log("Appointment booked successfully!");
          },
        });
        appointmentInitialized.current = true;
      }

      // Initialize Enquiry Form
      if (
        window.MedosEnquiry &&
        enquiryContainerRef.current &&
        !enquiryInitialized.current
      ) {
        window.MedosEnquiry.init({
          containerId: "index-enquiry-widget",
          apiKey: API_KEY,
          mode: "inline",
          onError: (err) => {
            console.error("Enquiry error:", err);
          },
          onSuccess: () => {
            console.log("Enquiry submitted successfully!");
          },
        });
        enquiryInitialized.current = true;
      }
    };

    // Try to initialize immediately if SDK is already loaded
    if (window.MedosAppointment && window.MedosEnquiry) {
      initWidgets();
    } else {
      // Wait for SDK to load
      const checkInterval = setInterval(() => {
        if (window.MedosAppointment && window.MedosEnquiry) {
          initWidgets();
          clearInterval(checkInterval);
        }
      }, 100);

      // Cleanup
      return () => clearInterval(checkInterval);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <ServicesSection />
      <AboutSection />

      {/* SDK Components loaded via CDN */}
      <div className="py-12">
        <div
          id="index-appointment-widget"
          ref={appointmentContainerRef}
          className="min-h-[550px]"
        />
      </div>

      <div className="xl:px-72 px-10 mt-12">
        <div
          id="index-enquiry-widget"
          ref={enquiryContainerRef}
          className="min-h-[400px]"
        />
      </div>

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
