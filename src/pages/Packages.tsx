import { useEffect, useRef } from "react";

// Extend window to include the new Package SDK types
declare global {
    interface Window {
        MedosPackagePurchase?: {
            init: (options: {
                containerId: string;
                apiKey: string;
                onComplete?: () => void;
            }) => void;
        };
    }
}

const Packages = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const initialized = useRef(false);

    useEffect(() => {
        // Initialize the package purchase widget
        const initWidget = () => {
            if (
                window.MedosPackagePurchase &&
                containerRef.current &&
                !initialized.current
            ) {
                window.MedosPackagePurchase.init({
                    containerId: "package-widget-container",
                    apiKey: "mk_bf42d16d3fd0c7756dfa3b783061df98bf42d16d3fd0c7756dfa3b783061df98", // Use your actual key
                    onComplete: () => {
                        console.log("Package purchased successfully!");
                        // Optional: Navigate to appointments page after success
                        // window.location.href = "/appointments"; 
                    },
                });
                initialized.current = true;
            }
        };

        // Try to initialize immediately if SDK is already loaded
        if (window.MedosPackagePurchase) {
            initWidget();
        } else {
            // Wait for SDK to load (polling mechanism)
            const checkInterval = setInterval(() => {
                if (window.MedosPackagePurchase) {
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
            <div className="bg-green-600 text-white py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-2">Purchase Packages</h1>
                    <p className="text-lg opacity-90">
                        Save money by bundling your consultation sessions
                    </p>
                </div>
            </div>

            {/* Package Widget Section */}
            <div className="py-12">
                <div className="xl:px-72 px-4">
                    <div
                        id="package-widget-container"
                        ref={containerRef}
                        className="min-h-[550px] bg-white rounded-xl shadow-sm"
                    />
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-8 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm">
                        © 2025 Dr. Ralph's Clinic. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Packages;