'use client'

import { useState } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Brain, Menu, X } from "lucide-react"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full glass-strong border-b border-border/40">
      <div className="container relative flex h-16 items-center px-4 sm:px-6">
        <div className="mr-2 sm:mr-4 flex">
          <Link href="/" className="mr-4 sm:mr-6 flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-foreground text-sm sm:text-base">GitHub Analyzer</span>
              <span className="text-xs text-muted-foreground">Made by Yiyi</span>
            </div>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden sm:flex items-center space-x-4 lg:space-x-6 text-sm font-medium">
            <Link href="#features" className="transition-colors hover:text-foreground/80 text-foreground/60" onClick={() => setIsOpen(false)}>
              Features
            </Link>
            <Link href="#pricing" className="transition-colors hover:text-foreground/80 text-foreground/60" onClick={() => setIsOpen(false)}>
              Pricing
            </Link>
            <Link href="#demo" className="transition-colors hover:text-foreground/80 text-foreground/60" onClick={() => setIsOpen(false)}>
              Demo
            </Link>
          </nav>
          <div className="hidden sm:flex items-center space-x-2">
            <Button asChild size="sm" className="text-xs sm:text-sm">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            aria-label="Toggle menu"
            className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-muted/20 transition-colors"
            onClick={() => setIsOpen(o => !o)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {isOpen && (
          <div className="sm:hidden absolute top-16 left-0 right-0 px-4 sm:px-6 z-60 glass-strong border-b border-border/40 glass-enhance">
            <div className="p-4 flex flex-col gap-3">
              <Link href="#features" className="transition-colors hover:text-foreground text-foreground/80" onClick={() => setIsOpen(false)}>
                Features
              </Link>
              <Link href="#pricing" className="transition-colors hover:text-foreground text-foreground/80" onClick={() => setIsOpen(false)}>
                Pricing
              </Link>
              <Link href="#demo" className="transition-colors hover:text-foreground text-foreground/80" onClick={() => setIsOpen(false)}>
                Demo
              </Link>
              <div className="pt-2">
                <Button asChild size="sm" className="w-full">
                  <Link href="/auth/signin" onClick={() => setIsOpen(false)}>Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
