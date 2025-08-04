// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Label } from "@/components/ui/label"
// import { Navigation } from "@/components/navigation"
// import { useRouter } from "next/navigation"

// export default function AuthPage() {
//   const [isLoading, setIsLoading] = useState(false)
//   const router = useRouter()

//   const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     setIsLoading(true)

//     const formData = new FormData(e.currentTarget)
//     const email = formData.get("email") as string
//     const password = formData.get("password") as string

//     try {
//       const response = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       })

//       if (response.ok) {
//         const user = await response.json()
//         localStorage.setItem("user", JSON.stringify(user))
//         router.push("/")
//       } else {
//         alert("Login failed")
//       }
//     } catch (error) {
//       console.error("Login error:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     setIsLoading(true)

//     const formData = new FormData(e.currentTarget)
//     const name = formData.get("name") as string
//     const email = formData.get("email") as string
//     const password = formData.get("password") as string

//     try {
//       const response = await fetch("/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, email, password }),
//       })

//       if (response.ok) {
//         const user = await response.json()
//         localStorage.setItem("user", JSON.stringify(user))
//         router.push("/")
//       } else {
//         alert("Signup failed")
//       }
//     } catch (error) {
//       console.error("Signup error:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-blue-200 p-4">
//       <div className="max-w-4xl mx-auto">
//         <Navigation />

//         <div className="flex items-center justify-center min-h-[70vh]">
//           <Card className="w-full max-w-md border-4 border-black rounded-3xl">
//             <CardHeader className="text-center">
//               <CardTitle className="text-3xl font-bold">Join the YES! Movement</CardTitle>
//               <p className="text-gray-600">Start saying YES to life and earning money!</p>
//             </CardHeader>
//             <CardContent>
//               <Tabs defaultValue="login" className="w-full">
//                 <TabsList className="grid w-full grid-cols-2 mb-6">
//                   <TabsTrigger value="login">Login</TabsTrigger>
//                   <TabsTrigger value="signup">Sign Up</TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="login">
//                   <form onSubmit={handleLogin} className="space-y-4">
//                     <div>
//                       <Label htmlFor="login-email">Email</Label>
//                       <Input
//                         id="login-email"
//                         name="email"
//                         type="email"
//                         required
//                         className="border-2 border-black rounded-xl"
//                       />
//                     </div>
//                     <div>
//                       <Label htmlFor="login-password">Password</Label>
//                       <Input
//                         id="login-password"
//                         name="password"
//                         type="password"
//                         required
//                         className="border-2 border-black rounded-xl"
//                       />
//                     </div>
//                     <Button
//                       type="submit"
//                       disabled={isLoading}
//                       className="w-full bg-green-500 hover:bg-green-600 border-2 border-black rounded-xl font-bold py-3"
//                     >
//                       {isLoading ? "Logging in..." : "YES! Log Me In"}
//                     </Button>
//                   </form>
//                 </TabsContent>

//                 <TabsContent value="signup">
//                   <form onSubmit={handleSignup} className="space-y-4">
//                     <div>
//                       <Label htmlFor="signup-name">Name</Label>
//                       <Input
//                         id="signup-name"
//                         name="name"
//                         type="text"
//                         required
//                         className="border-2 border-black rounded-xl"
//                       />
//                     </div>
//                     <div>
//                       <Label htmlFor="signup-email">Email</Label>
//                       <Input
//                         id="signup-email"
//                         name="email"
//                         type="email"
//                         required
//                         className="border-2 border-black rounded-xl"
//                       />
//                     </div>
//                     <div>
//                       <Label htmlFor="signup-password">Password</Label>
//                       <Input
//                         id="signup-password"
//                         name="password"
//                         type="password"
//                         required
//                         className="border-2 border-black rounded-xl"
//                       />
//                     </div>
//                     <Button
//                       type="submit"
//                       disabled={isLoading}
//                       className="w-full bg-yellow-600 hover:bg-yellow-700 border-2 border-black rounded-xl font-bold py-3"
//                     >
//                       {isLoading ? "Creating account..." : "YES! Sign Me Up"}
//                     </Button>
//                   </form>
//                 </TabsContent>
//               </Tabs>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const router = useRouter()

  useEffect(() => {
    // Since we removed auth, just redirect to challenge page
    router.push("/challenge")
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-blue-200 p-4 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">🚀 Redirecting to Challenges...</h1>
        <p className="text-lg text-gray-700">Get ready to say YES to life!</p>
      </div>
    </div>
  )
}
