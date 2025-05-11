
"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react"; // Ensure React is imported for React.cloneElement
import { Gavel, Menu, History, HelpCircle, PackagePlus } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";


const navLinks = [
  { href: "/", label: "Home", icon: null },
  { href: "/auctions", label: "Auctions", icon: null },
  { href: "/activity", label: "Activity", icon: <History className="h-4 w-4" /> },
  { href: "/sell", label: "Add Item", icon: <PackagePlus className="h-4 w-4" /> }, 
  { href: "/help", label: "Help", icon: <HelpCircle className="h-4 w-4" /> },
  // Login and Signup are handled separately for desktop button styling but included for mobile iteration
  { href: "/login", label: "Login", icon: null },
  { href: "/signup", label: "Sign Up", icon: null },
];

// Determine which links are shown in the centered section on desktop
const desktopMainLinkCount = 5; // Home, Auctions, Activity, Add Item, Help

export function Navbar() {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-sky-500/95 text-primary-foreground backdrop-blur supports-[backdrop-filter]:bg-sky-500/60 shadow-md">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2">
            <Gavel className="h-7 w-7" />
            <span className="text-xl font-bold">BidVerse</span>
          </Link>
          
          {/* Mobile Skeleton Trigger */}
          <div className="h-8 w-20 animate-pulse rounded-md bg-sky-400/50 md:hidden"></div>

          {/* Desktop Skeleton Nav */}
          {/* Skeleton for Centered Nav Links */}
          <div className="hidden md:flex flex-grow justify-center items-center mx-4">
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                <div className="h-5 w-16 animate-pulse rounded-md bg-sky-400/50"></div> {/* Home */}
                <div className="h-5 w-20 animate-pulse rounded-md bg-sky-400/50"></div> {/* Auctions */}
                <div className="h-5 w-20 animate-pulse rounded-md bg-sky-400/50"></div> {/* Activity */}
                <div className="h-5 w-20 animate-pulse rounded-md bg-sky-400/50"></div> {/* Add Item */}
                <div className="h-5 w-16 animate-pulse rounded-md bg-sky-400/50"></div> {/* Help */}
            </div>
          </div>
          {/* Skeleton for Auth Buttons */}
          <div className="hidden md:flex flex-shrink-0 items-center gap-1 sm:gap-2">
            <div className="h-10 w-20 animate-pulse rounded-md bg-sky-400/50"></div> {/* Login Button */}
            <div className="h-10 w-24 animate-pulse rounded-md bg-sky-400/50"></div> {/* Signup Button */}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-sky-500/95 text-primary-foreground backdrop-blur supports-[backdrop-filter]:bg-sky-500/60 shadow-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
          <Gavel className="h-7 w-7" />
          <span className="text-xl font-bold">BidVerse</span>
        </Link>

        {isMobile ? (
          // Mobile Menu
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-sky-600 focus-visible:ring-white">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] pt-10 bg-sky-500 text-primary-foreground border-l-sky-600">
              <Link href="/" className="flex items-center gap-2 mb-8 px-6" onClick={() => setMobileMenuOpen(false)}>
                <Gavel className="h-7 w-7" />
                <span className="text-xl font-bold">BidVerse</span>
              </Link>
              <nav className="flex flex-col gap-1 px-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-bold hover:bg-sky-600/70 px-4 py-2.5 rounded-md transition-colors flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.icon && React.cloneElement(link.icon, { className: `${link.icon.props.className} mr-2.5`})} {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          // Desktop Navigation
          <>
            {/* Centered Main Navigation Links */}
            <nav className="hidden md:flex flex-grow justify-center items-center mx-4">
              <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                {navLinks.slice(0, desktopMainLinkCount).map((link) => ( 
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-base font-bold hover:bg-sky-600/70 px-3 py-2 rounded-md transition-colors flex items-center"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
            
            {/* Auth Buttons (Login/Sign Up) - Aligned to the right */}
            <div className="hidden md:flex flex-shrink-0 items-center gap-1 sm:gap-2">
              <Button variant="ghost" asChild className="hover:bg-sky-600/70 focus-visible:ring-white">
                <Link href="/login" className="font-bold text-base">Login</Link>
              </Button>
              <Button variant="secondary" asChild className="bg-primary-foreground text-sky-600 hover:bg-primary-foreground/90 focus-visible:ring-white">
                <Link href="/signup" className="font-bold text-base">Sign Up</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

