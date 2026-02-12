import { useEffect, useRef } from "react";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";

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
    // 1. ADD PACKAGE INTERFACE HERE
    MedosPackagePurchase?: {
      init: (options: {
        containerId: string;
        apiKey: string;
        onComplete?: () => void;
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
  "mk_8babbe01aecf4047e27541ebd0fbbccd8babbe01aecf4047e27541ebd0fbbccd";

const Index = () => {
  const appointmentContainerRef = useRef<HTMLDivElement>(null);
  const enquiryContainerRef = useRef<HTMLDivElement>(null);
  // 2. ADD REF FOR PACKAGES
  const packageContainerRef = useRef<HTMLDivElement>(null);

  const appointmentInitialized = useRef(false);
  const enquiryInitialized = useRef(false);
  const packageInitialized = useRef(false);

  useEffect(() => {
    // Initialize all widgets
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

      // 3. INITIALIZE PACKAGE WIDGET
      if (
        window.MedosPackagePurchase &&
        packageContainerRef.current &&
        !packageInitialized.current
      ) {
        window.MedosPackagePurchase.init({
          containerId: "index-package-widget",
          apiKey: API_KEY,
          onComplete: () => {
            console.log("Package purchase flow completed!");
          },
        });
        packageInitialized.current = true;
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
    if (window.MedosAppointment || window.MedosPackagePurchase) {
      initWidgets();
    } else {
      // Wait for SDK to load
      const checkInterval = setInterval(() => {
        if (window.MedosAppointment || window.MedosPackagePurchase) {
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

      {/* Appointment Widget */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Book Appointment</h2>
          <div className="xl:px-72 px-4">
            <div
              id="index-appointment-widget"
              ref={appointmentContainerRef}
              className="min-h-[550px]"
            />
          </div>
        </div>
      </div>

      {/* 4. PACKAGE WIDGET SECTION */}
      <div className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Purchase Packages</h2>
          <div className="xl:px-72 px-4">
            <div
              id="index-package-widget"
              ref={packageContainerRef}
              className="min-h-[550px] bg-white rounded-xl shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Enquiry Widget */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Have Questions?</h2>
          <div className="xl:px-72 px-10">
            <div
              id="index-enquiry-widget"
              ref={enquiryContainerRef}
              className="min-h-[400px]"
            />
          </div>
        </div>
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