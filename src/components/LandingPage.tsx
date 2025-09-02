import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Calculator, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-illustration.jpg";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background font-poppins">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary">RecoveryPath</div>
        <div className="hidden md:flex space-x-8">
          <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
          <a href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors">Stories</a>
          <a href="#support" className="text-muted-foreground hover:text-primary transition-colors">Support</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-calm-blue-light to-soft-green-light opacity-60"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Your Path to Recovery 
                <span className="text-primary block">Starts Here!</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Take control of your journey with personalized support, professional guidance, 
                and a community that understands. Every step forward matters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="hero" className="text-lg px-8 py-4">
                  Join Now
                </Button>
                <Link to="/dashboard">
                  <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="People supporting each other in recovery journey"
                className="w-full h-auto rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Comprehensive Support for Your Journey
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge technology with human compassion 
              to provide personalized care every step of the way.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Real-time Health Tracking</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Monitor your progress with intelligent tracking that adapts to your unique recovery path.
                  Daily check-ins, mood tracking, and personalized insights.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-soft-green" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Professional & Peer Support</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Connect with licensed professionals and supportive peers who understand your journey.
                  24/7 access to care when you need it most.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Calculator className="w-8 h-8 text-warning" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Relapse Risk Calculator</h3>
                <p className="text-muted-foreground leading-relaxed">
                  AI-powered risk assessment that provides personalized strategies and 
                  early intervention when you need extra support.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Stories of Hope</h2>
            <p className="text-xl text-muted-foreground">Real people, real recovery stories</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex text-warning mb-2">
                    {"★".repeat(5)}
                  </div>
                  <p className="text-muted-foreground italic">
                    "This platform gave me the tools and community I needed to rebuild my life. 
                    The risk calculator helped me recognize patterns I couldn't see on my own."
                  </p>
                </div>
                <div className="font-semibold">Sarah M.</div>
                <div className="text-sm text-muted-foreground">2 years sober</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-secondary">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex text-warning mb-2">
                    {"★".repeat(5)}
                  </div>
                  <p className="text-muted-foreground italic">
                    "Having 24/7 access to support made all the difference during my toughest moments. 
                    The peer network is incredible."
                  </p>
                </div>
                <div className="font-semibold">Marcus J.</div>
                <div className="text-sm text-muted-foreground">18 months in recovery</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-accent">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex text-warning mb-2">
                    {"★".repeat(5)}
                  </div>
                  <p className="text-muted-foreground italic">
                    "The professional support and daily tracking features helped me stay accountable. 
                    I finally feel in control of my recovery."
                  </p>
                </div>
                <div className="font-semibold">Elena R.</div>
                <div className="text-sm text-muted-foreground">6 months strong</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary to-soft-green">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Take the first step towards a healthier future
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands who have transformed their lives with personalized support and proven strategies.
          </p>
          <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
            Start My Journey
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-16 border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-primary mb-4">RecoveryPath</div>
              <p className="text-muted-foreground">
                Supporting your journey to recovery with compassion, technology, and community.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <div className="text-muted-foreground">24/7 Helpline</div>
                <div className="font-semibold text-primary">1-800-RECOVERY</div>
                <div className="text-muted-foreground">Crisis Text Line: TEXT HOME to 741741</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <div className="space-y-2 text-muted-foreground">
                <div>Treatment Locator</div>
                <div>Recovery Stories</div>
                <div>Family Support</div>
                <div>Professional Training</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-muted-foreground">
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
                <div>HIPAA Compliance</div>
                <div>Contact Us</div>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            © 2024 RecoveryPath. All rights reserved. Licensed healthcare technology platform.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;