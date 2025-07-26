import { createORPCClient } from "@orpc/client"

export const orpc = createORPCClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
})
