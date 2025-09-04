import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

export function ClerkAuthForm() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-blue-light to-soft-green-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-primary">QuitBuddy</Link>
          <p className="text-muted-foreground mt-2">Your journey to recovery starts here</p>
        </div>

        <SignedOut>
          <Card className="shadow-lg">
            <Tabs defaultValue="signin" className="w-full">
              <CardHeader>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent>
                <TabsContent value="signin" className="space-y-4">
                  <CardDescription>
                    Welcome back! Sign in to continue your recovery journey.
                  </CardDescription>
                  
                  <div className="space-y-4">
                    <SignInButton forceRedirectUrl="/dashboard">
                      <Button className="w-full">Sign In</Button>
                    </SignInButton>
                  </div>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <CardDescription>
                    Join our supportive community and start your recovery journey today.
                  </CardDescription>
                  
                  <div className="space-y-4">
                    <SignUpButton forceRedirectUrl="/dashboard">
                      <Button className="w-full">Create Account</Button>
                    </SignUpButton>
                  </div>
                </TabsContent>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
                </div>
              </CardContent>
            </Tabs>
          </Card>
        </SignedOut>

        <SignedIn>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Welcome back!</CardTitle>
              <CardDescription>You're already signed in.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <UserButton />
                <Button asChild>
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </SignedIn>
      </div>
    </div>
  );
}