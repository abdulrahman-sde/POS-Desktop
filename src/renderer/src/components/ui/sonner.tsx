"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CloseCircle, InfoCircle, Loader, TickCircle, Warning } from "reicon-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      richColors
      className="toaster group"
      icons={{
        success: (
          <TickCircle className="size-4" />
        ),
        info: (
          <InfoCircle className="size-4" />
        ),
        warning: (
          <Warning className="size-4" />
        ),
        error: (
          <CloseCircle className="size-4" />
        ),
        loading: (
          <Loader className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
