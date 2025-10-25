import { Heart, Stethoscope, Activity, UserCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    icon: Stethoscope,
    title: "General Consultation",
    description: "Comprehensive health checkups and medical advice for all ages"
  },
  {
    icon: Heart,
    title: "Preventive Care",
    description: "Regular screenings and health maintenance programs"
  },
  {
    icon: Activity,
    title: "Chronic Disease Management",
    description: "Ongoing care for diabetes, hypertension, and other conditions"
  },
  {
    icon: UserCheck,
    title: "Family Medicine",
    description: "Complete healthcare solutions for the entire family"
  }
];

const ServicesSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Our Services</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Dedicated to providing comprehensive healthcare services tailored to your needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
