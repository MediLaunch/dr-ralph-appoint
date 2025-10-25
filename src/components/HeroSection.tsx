import { Button } from "@/components/ui/button";
import heroImage from "@/assets/clinic-hero.jpg";

interface HeroSectionProps {
  onBookAppointment: () => void;
}

const HeroSection = ({ onBookAppointment }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/80" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-20 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
          Welcome to Dr. Ralph's Clinic
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-95">
          Providing exceptional healthcare services with compassion and expertise
        </p>
        <Button 
          size="lg" 
          onClick={onBookAppointment}
          className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
        >
          Book Your Appointment
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
