import { SignIn, SignUp } from '@clerk/clerk-react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link } from "react-router-dom"

export function ClerkAuthForm() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-blue-light to-soft-green-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-primary">QuitBuddy</Link>
          <p className="text-muted-foreground mt-2">Your journey to recovery starts here</p>
        </div>

        <Card className="shadow-lg">
          <Tabs defaultValue="signin" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent className="space-y-6">
              <TabsContent value="signin">
                <div className="flex justify-center">
                  <SignIn 
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "shadow-none border-0 bg-transparent",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "bg-background border border-border hover:bg-accent",
                        formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
                        formFieldInput: "border-border bg-background",
                        footerActionLink: "text-primary hover:text-primary/80"
                      }
                    }}
                    redirectUrl="/dashboard"
                  />
                </div>
              </TabsContent>

              <TabsContent value="signup">
                <div className="flex justify-center">
                  <SignUp 
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "shadow-none border-0 bg-transparent",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "bg-background border border-border hover:bg-accent",
                        formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
                        formFieldInput: "border-border bg-background",
                        footerActionLink: "text-primary hover:text-primary/80"
                      }
                    }}
                    redirectUrl="/dashboard"
                  />
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}