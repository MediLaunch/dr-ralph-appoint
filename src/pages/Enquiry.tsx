import { useEffect, useRef } from "react";

// Extend window to include MedOS SDK types
declare global {
  interface Window {
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

const Enquiry = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Initialize the enquiry form widget
    const initWidget = () => {
      if (window.MedosEnquiry && containerRef.current && !initialized.current) {
        window.MedosEnquiry.init({
          containerId: "enquiry-widget-container",
          apiKey:
            "mk_8babbe01aecf4047e27541ebd0fbbccd8babbe01aecf4047e27541ebd0fbbccd",
          mode: "inline",
          onError: (err) => {
            console.error("Enquiry form error:", err);
          },
          onSuccess: () => {
            console.log("Enquiry submitted successfully!");
          },
        });
        initialized.current = true;
      }
    };

    // Try to initialize immediately if SDK is already loaded
    if (window.MedosEnquiry) {
      initWidget();
    } else {
      // Wait for SDK to load
      const checkInterval = setInterval(() => {
        if (window.MedosEnquiry) {
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
          <h1 className="text-4xl font-bold mb-2">Send us an Enquiry</h1>
          <p className="text-lg opacity-90">
            Have questions? Get in touch with our team
          </p>
        </div>
      </div>

      {/* Enquiry Form Section */}
      <div className="py-12">
        <div className="xl:px-72 px-10">
          <div
            id="enquiry-widget-container"
            ref={containerRef}
            className="min-h-[550px]"
          />
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

export default Enquiry;
