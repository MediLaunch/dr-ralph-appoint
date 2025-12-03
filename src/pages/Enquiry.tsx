import { EnquiryForm, defaultTheme, MedosThemeProvider } from "medos-sdk";

const Enquiry = () => {
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
        <MedosThemeProvider theme={defaultTheme}>
          <div className="xl:px-72 px-10">
            <EnquiryForm />
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

export default Enquiry;
