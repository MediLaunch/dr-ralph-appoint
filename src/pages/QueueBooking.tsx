import { QueueBooking, defaultTheme, MedosThemeProvider } from "medos-sdk";

const QueueBookingPage = () => {
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
        <MedosThemeProvider theme={defaultTheme}>
          <div className="xl:px-72 px-10">
            <QueueBooking
              onError={(err) => {
                console.error("Queue booking error:", err);
              }}
              onSuccess={(token) => {
                console.log("Booking successful!");
                console.log("Token Number:", token.tokenNumber);
                console.log("Queue Position:", token.queuePosition);
                console.log(
                  "Estimated Wait:",
                  token.estimatedWaitTime,
                  "minutes"
                );
              }}
              initialQueueStats={{
                currentPatientCount: 12,
                estimatedWaitTime: 28,
                queueOpenTime: "9:00 AM",
                queueCloseTime: "6:00 PM",
                isQueueOpen: true,
              }}
            />
          </div>
        </MedosThemeProvider>
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
