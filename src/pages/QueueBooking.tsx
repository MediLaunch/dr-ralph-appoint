import { useEffect, useRef } from "react";

// Extend window to include MedOS SDK types
declare global {
  interface Window {
    MedosQueueBooking?: {
      init: (options: {
        containerId: string;
        apiKey?: string;
        onError?: (error: Error) => void;
        onSuccess?: (token: {
          tokenNumber: string;
          queuePosition: number;
          estimatedWaitTime: number;
        }) => void;
        initialQueueStats?: {
          currentPatientCount: number;
          estimatedWaitTime: number;
          queueOpenTime: string;
          queueCloseTime: string;
          isQueueOpen: boolean;
        };
      }) => void;
    };
  }
}

const QueueBookingPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Initialize the queue booking widget from CDN
    const initWidget = () => {
      if (
        window.MedosQueueBooking &&
        containerRef.current &&
        !initialized.current
      ) {
        window.MedosQueueBooking.init({
          containerId: "queue-widget-container",
          apiKey:
            "mk_e088643d3f5c0b2b2ae339cb34240631e088643d3f5c0b2b2ae339cb34240631",
          onError: (err) => {
            console.error("Queue booking error:", err);
          },
          onSuccess: (token) => {
            console.log("Booking successful!");
            console.log("Token Number:", token.tokenNumber);
            console.log("Queue Position:", token.queuePosition);
            console.log("Estimated Wait:", token.estimatedWaitTime, "minutes");
          },
          initialQueueStats: {
            currentPatientCount: 12,
            estimatedWaitTime: 28,
            queueOpenTime: "9:00 AM",
            queueCloseTime: "6:00 PM",
            isQueueOpen: true,
          },
        });
        initialized.current = true;
      }
    };

    // Try to initialize immediately if SDK is already loaded
    if (window.MedosQueueBooking) {
      initWidget();
    } else {
      // Wait for SDK to load
      const checkInterval = setInterval(() => {
        if (window.MedosQueueBooking) {
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
          <h1 className="text-4xl font-bold mb-2">Join the Queue</h1>
          <p className="text-lg opacity-90">
            Get your token and wait time estimate for walk-in appointments
          </p>
        </div>
      </div>

      {/* Queue Booking Section */}
      <div className="py-12">
        <div className="xl:px-72 px-10">
          <div
            id="queue-widget-container"
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

export default QueueBookingPage;
