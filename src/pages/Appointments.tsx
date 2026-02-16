import { useEffect, useRef } from "react";

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
  }
}

const Appointments = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Initialize the appointment calendar widget
    const initWidget = () => {
      if (
        window.MedosAppointment &&
        containerRef.current &&
        !initialized.current
      ) {
        window.MedosAppointment.init({
          containerId: "appointment-widget-container",
          apiKey:
            "mk_6b2285a39610e8bf67e746f41c849ccb6b2285a39610e8bf67e746f41c849ccb",
          mode: "inline",
          onError: (err) => {
            console.error("Appointment booking error:", err);
          },
          onSuccess: () => {
            console.log("Appointment booked successfully!");
          },
        });
        initialized.current = true;
      }
    };

    // Try to initialize immediately if SDK is already loaded
    if (window.MedosAppointment) {
      initWidget();
    } else {
      // Wait for SDK to load
      const checkInterval = setInterval(() => {
        if (window.MedosAppointment) {
          initWidget();
          clearInterval(checkInterval);
        }
      }, 100);

      // Cleanup
      return () => clearInterval(checkInterval);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header Section */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Book an Appointment</h1>
          <p className="text-lg opacity-90">
            Schedule your visit with our healthcare professionals
          </p>
        </div>
      </div>

      {/* Appointment Calendar Section */}
      <div className="py-12">
        <div className="px-4">
          <div id="appointment-widget-container" ref={containerRef} className="min-h-[800px] max-w-[1140px] mx-auto" />
        </div>
      </div>


      {/* Footer */}
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

export default Appointments;
