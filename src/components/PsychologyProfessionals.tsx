import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Brain, 
  Stethoscope, 
  Star, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  Award,
  GraduationCap,
  Clock,
  Heart,
  Shield,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const PsychologyProfessionals = () => {
  const [selectedType, setSelectedType] = useState<"all" | "psychologist" | "psychiatrist">("all");

  const professionals = [
    {
      id: 1,
      name: "Dr. Sarah Mitchell",
      type: "psychologist",
      specialty: "Addiction Psychology",
      rating: 4.9,
      reviews: 247,
      location: "Downtown Medical Center",
      phone: "(555) 123-4567",
      email: "s.mitchell@healthcenter.com",
      experience: "12+ years",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face",
      description: "Specializes in substance abuse therapy with a focus on cognitive-behavioral therapy and mindfulness techniques.",
      credentials: ["PhD Psychology", "Licensed Clinical Psychologist", "Addiction Counseling Certified"],
      available: "Mon-Fri, 9AM-6PM",
      nextAvailable: "Tomorrow 2:00 PM",
      acceptingNew: true,
      languages: ["English", "Spanish"],
      insurance: ["Most Major Insurance", "Self-Pay Options"]
    },
    {
      id: 2,
      name: "Dr. Michael Rodriguez",
      type: "psychiatrist",
      specialty: "Addiction Psychiatry",
      rating: 4.8,
      reviews: 189,
      location: "Recovery Medical Plaza",
      phone: "(555) 234-5678",
      email: "m.rodriguez@recoverymed.com",
      experience: "15+ years",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face",
      description: "Board-certified psychiatrist specializing in medication-assisted treatment and dual diagnosis care.",
      credentials: ["MD Psychiatry", "Board Certified Psychiatrist", "Addiction Medicine Specialist"],
      available: "Tue-Sat, 8AM-5PM",
      nextAvailable: "Friday 10:30 AM",
      acceptingNew: true,
      languages: ["English", "Spanish", "Portuguese"],
      insurance: ["Medicare", "Most PPO Plans", "Self-Pay"]
    },
    {
      id: 3,
      name: "Dr. Emma Thompson",
      type: "psychologist",
      specialty: "Trauma & Recovery",
      rating: 4.9,
      reviews: 312,
      location: "Wellness Recovery Center",
      phone: "(555) 345-6789",
      email: "e.thompson@wellnessrc.com",
      experience: "10+ years",
      image: "https://images.unsplash.com/photo-1594824387347-216d16d2ca8c?w=200&h=200&fit=crop&crop=face",
      description: "Expert in trauma-informed care and EMDR therapy for individuals overcoming addiction and trauma.",
      credentials: ["PsyD Clinical Psychology", "EMDR Certified", "Trauma-Informed Care Specialist"],
      available: "Mon-Thu, 10AM-7PM",
      nextAvailable: "Monday 11:00 AM",
      acceptingNew: true,
      languages: ["English", "French"],
      insurance: ["Most Major Insurance", "Employee Assistance Programs"]
    },
    {
      id: 4,
      name: "Dr. James Chen",
      type: "psychiatrist",
      specialty: "Integrated Mental Health",
      rating: 4.7,
      reviews: 156,
      location: "Mindful Health Institute",
      phone: "(555) 456-7890",
      email: "j.chen@mindfulhealth.com",
      experience: "8+ years",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop&crop=face",
      description: "Combines traditional psychiatry with holistic approaches for comprehensive addiction treatment.",
      credentials: ["MD Psychiatry", "Holistic Medicine Certified", "Mindfulness-Based Therapy"],
      available: "Wed-Sun, 9AM-4PM",
      nextAvailable: "Wednesday 3:00 PM",
      acceptingNew: false,
      languages: ["English", "Mandarin"],
      insurance: ["Select Insurance Plans", "Self-Pay Discounts"]
    }
  ];

  const filteredProfessionals = selectedType === "all" 
    ? professionals 
    : professionals.filter(prof => prof.type === selectedType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 font-poppins p-4">
      <div className="container mx-auto max-w-7xl">
        <Link to="/dashboard" className="inline-flex items-center text-primary hover:text-primary/80 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
              Find Your Perfect Match
            </h1>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary/20 rounded-full blur-lg" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Connect with experienced psychology professionals who specialize in addiction recovery and mental health support.
          </p>
          
          {/* Filter Pills */}
          <div className="flex justify-center gap-4 mb-8">
            {[
              { value: "all", label: "All Professionals", icon: Heart },
              { value: "psychologist", label: "Psychologists", icon: Brain },
              { value: "psychiatrist", label: "Psychiatrists", icon: Stethoscope }
            ].map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                variant={selectedType === value ? "default" : "outline"}
                onClick={() => setSelectedType(value as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  selectedType === value 
                    ? "shadow-lg shadow-primary/25 scale-105" 
                    : "hover:shadow-md hover:scale-102"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Professionals Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {filteredProfessionals.map((professional) => (
            <Card key={professional.id} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-card via-card/95 to-primary/5">
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                <Badge 
                  variant={professional.acceptingNew ? "default" : "secondary"}
                  className={`${
                    professional.acceptingNew 
                      ? "bg-success text-white shadow-lg shadow-success/25" 
                      : "bg-muted text-muted-foreground"
                  } transition-all duration-300`}
                >
                  {professional.acceptingNew ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Accepting New Patients
                    </>
                  ) : "Waitlist Only"}
                </Badge>
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  {/* Professional Image */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                      <img 
                        src={professional.image} 
                        alt={professional.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                      professional.type === 'psychologist' ? 'bg-brain text-white' : 'bg-primary text-white'
                    }`}>
                      {professional.type === 'psychologist' ? 
                        <Brain className="w-3 h-3" /> : 
                        <Stethoscope className="w-3 h-3" />
                      }
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                      {professional.name}
                    </CardTitle>
                    <p className="text-primary font-medium mb-2">{professional.specialty}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < Math.floor(professional.rating) 
                                ? 'fill-warning text-warning' 
                                : 'text-muted-foreground'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="font-medium">{professional.rating}</span>
                      <span className="text-muted-foreground">({professional.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">
                  {professional.description}
                </p>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      <span className="font-medium">{professional.experience}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="truncate">{professional.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{professional.available}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>{professional.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="truncate">{professional.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-success" />
                      <span className="text-success font-medium">{professional.nextAvailable}</span>
                    </div>
                  </div>
                </div>

                {/* Credentials */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="font-medium">Credentials</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {professional.credentials.map((cred, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {cred}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Languages & Insurance */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      Insurance
                    </h4>
                    <div className="space-y-1">
                      {professional.insurance.map((ins, index) => (
                        <p key={index} className="text-sm text-muted-foreground">{ins}</p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Languages</h4>
                    <p className="text-sm text-muted-foreground">
                      {professional.languages.join(", ")}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Link to={`/dashboard/appointments?provider=${professional.name}&type=${professional.type}`} className="flex-1">
                    <Button className="w-full shadow-lg hover:shadow-xl transition-all duration-300">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Appointment
                    </Button>
                  </Link>
                  <Button variant="outline" className="px-6 hover:bg-primary/10">
                    View Profile
                  </Button>
                </div>
              </CardContent>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </Card>
          ))}
        </div>

        {/* Emergency Support Section */}
        <Card className="mt-12 bg-gradient-to-r from-destructive/10 via-destructive/5 to-transparent border-destructive/20">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Need Immediate Support?</h3>
                <p className="text-muted-foreground">Crisis resources available 24/7</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="destructive" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Crisis Hotline: 988
              </Button>
              <Button variant="outline" className="flex items-center gap-2 border-destructive/30 text-destructive hover:bg-destructive/10">
                <Phone className="w-4 h-4" />
                Emergency: 911
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Crisis Chat Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PsychologyProfessionals;