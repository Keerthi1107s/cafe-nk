"use client"

import { Coffee, User, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCafeStore } from "@/lib/cafe-store"

export function LoginScreen() {
  const setUserRole = useCafeStore((state) => state.setUserRole)

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/30 to-background">
      <Card className="w-full max-w-md shadow-xl border-2 border-primary/10">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Coffee className="w-10 h-10 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl md:text-3xl font-bold text-primary text-balance">Rameshwaram Cafe</CardTitle>
            <CardDescription className="text-base mt-2 text-muted-foreground">
              Smart Seat Availability & Queue Management
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <p className="text-center text-sm text-muted-foreground mb-6">🔐 Select your role to continue</p>
          <Button
            onClick={() => setUserRole("staff")}
            className="w-full h-14 text-lg gap-3 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-[1.02]"
          >
            <Users className="w-5 h-5" />
            Staff Dashboard
          </Button>
          <Button
            onClick={() => setUserRole("customer")}
            variant="outline"
            className="w-full h-14 text-lg gap-3 border-2 border-primary/30 hover:bg-primary/5 hover:border-primary/50 transition-all duration-200 hover:scale-[1.02]"
          >
            <User className="w-5 h-5" />
            Customer View
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
