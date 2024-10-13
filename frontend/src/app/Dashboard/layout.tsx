'use client'
import Link from "next/link"
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useUser } from "../context/userContext"
import { useRouter, usePathname } from "next/navigation"
import { use } from "react"

export const description =
  "A products dashboard with a sidebar navigation and a main content area. The dashboard has a header with a search input and a user menu. The sidebar has a logo, navigation links, and a card with a call to action. The main content area shows an empty state with a call to action."

export default function DashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const { user } = useUser()
    const router = useRouter()
    if(!user){
      router.push('/')
    } 
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">RiConnect Dashboard</span>
            </Link>
            
          </div>
          <div className="flex-1">
          
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
           <div className=" flex justify-center items-center ">
               
                <Link href="/Dashboard/createEvent"><Button variant="default" size={"lg"} className=" px-16 mb-4 mt-1 " > Create Event + </Button></Link>
           </div>
              <Link
                href="/Dashboard"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-blue-500 hover:text-white  transform hover:scale-105 duration-300"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/Dashboard/Giveaways"
                 className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-blue-500 hover:text-white transform hover:scale-105 duration-300"
              >
                <ShoppingCart className="h-4 w-4" />
                Giveaways
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  6
                </Badge>
              </Link>
              <Link
                href="/Dashboard/Events"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-blue-500 hover:text-white  transform hover:scale-105 duration-300"
                
              >
                <Package className="h-4 w-4" />
                Events{" "}
              </Link>
              <Link
                href="/Dashboard/YourClub"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-blue-500 hover:text-white  transform hover:scale-105 duration-300"
              >
                <Users className="h-4 w-4" />
                Your club
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-blue-500 hover:text-white y transform hover:scale-105 duration-300"
              >
                <LineChart className="h-4 w-4" />
                Analytics
              </Link>
            </nav>
          </div>
         
        </div>
      </div>
      <div className="flex flex-col bg-white">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px- bg-white">
          <Sheet >
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col bg-white">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 bg-white">
           <div className=" flex justify-center items-center ">
               
                <Link href="/Dashboard/createEvent"><Button variant="default" size={"lg"} className=" px-16 mb-4 mt-1 " > Create Event + </Button></Link>
           </div>
              <Link
                href="/Dashboard"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-blue-500 hover:text-primary transform hover:scale-105 duration-300"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/Dashboard/Giveaways"
                 className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-blue-500 hover:text-primary transform hover:scale-105 duration-300"
              >
                <ShoppingCart className="h-4 w-4" />
                Giveaways
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  6
                </Badge>
              </Link>
              <Link
                href="/Dashboard/Events"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-blue-500 hover:text-primary transform hover:scale-105 duration-300"
                
              >
                <Package className="h-4 w-4" />
                Events{" "}
              </Link>
              <Link
                href="/Dashboard/YourClub"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-blue-500 hover:text-white  transform hover:scale-105 duration-300"
              >
                <Users className="h-4 w-4" />
                Your club
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-blue-500 hover:text-white  transform hover:scale-105 duration-300"
              >
                <LineChart className="h-4 w-4" />
                Analytics
              </Link>
            </nav>
             
            </SheetContent>
          </Sheet>
           
           
            
          <div className="flex justify-end w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        {children}
        </main>
      </div>
    </div>
  )
}
