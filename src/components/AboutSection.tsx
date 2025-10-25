import { Card, CardContent } from "@/components/ui/card";
import { Award, GraduationCap, Users } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">About Dr. Ralph</h2>
            <p className="text-muted-foreground text-lg">
              Board-certified physician with over 15 years of experience in family medicine
            </p>
          </div>

          <Card className="mb-8 border-border shadow-md">
            <CardContent className="p-8">
              <p className="text-foreground leading-relaxed mb-6">
                Dr. Ralph is a dedicated healthcare professional committed to providing personalized, 
                compassionate care to every patient. With extensive training and experience in family 
                medicine, Dr. Ralph takes a holistic approach to healthcare, focusing on prevention, 
                early detection, and comprehensive treatment plans.
              </p>
              <p className="text-foreground leading-relaxed">
                Our clinic is equipped with modern facilities and a caring team dedicated to ensuring 
                your comfort and wellbeing throughout your healthcare journey.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border text-center p-6">
              <Award className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">Certified Excellence</h3>
              <p className="text-muted-foreground text-sm">Board certified in Family Medicine</p>
            </Card>
            <Card className="border-border text-center p-6">
              <GraduationCap className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">15+ Years</h3>
              <p className="text-muted-foreground text-sm">Experience in patient care</p>
            </Card>
            <Card className="border-border text-center p-6">
              <Users className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">5000+ Patients</h3>
              <p className="text-muted-foreground text-sm">Trusted by the community</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
