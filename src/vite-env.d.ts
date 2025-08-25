/// <reference types="vite/client" />

// Add type declarations for the @ path alias
declare module "@/components/*" {
  import type { ComponentType } from "react"
  const component: ComponentType
  export default component
}
