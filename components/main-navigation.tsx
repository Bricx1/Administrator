"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  FileText,
  Settings,
  GraduationCap,
  FileCheck,
  Database,
  CheckCircle,
  Scan,
  CalendarIcon,
  ShieldIcon,
  StethoscopeIcon,
  BarChart3,
  Users,
  UserCheck,
  Activity,
  MessageSquare,
  BookOpen,
  Award,
  ClipboardCheck,
  PackageIcon,
  StarIcon,
  BrainIcon,
  PenTool,
  TrendingUp,
} from "lucide-react"

const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
    description: "Overview and quick access to key metrics",
  },
  {
    title: "Application Tracking",
    href: "/applications",
    icon: FileText,
    description: "Manage job applications and candidate pipeline",
  },
  {
    title: "Staff Management",
    href: "/staff-dashboard",
    icon: Users,
    description: "Employee information and management tools",
  },
  {
    title: "Patient & Referral Management",
    href: "/patient-tracking",
    icon: UserCheck,
    description: "Patient and referral tracking systems",
    children: [
      {
        title: "Patient Tracking",
        href: "/patient-tracking",
        icon: Activity,
        description: "Monitor patient status and care progression",
      },
      {
        title: "Live Referral Dashboard",
        href: "/referral-dashboard",
        icon: BarChart3,
        description: "Real-time referral monitoring and daily reports",
      },
      {
        title: "Referral Management",
        href: "/referral-management",
        icon: FileText,
        description: "Manage incoming referrals and automation",
      },
      {
        title: "Referral Configuration",
        href: "/referral-configuration",
        icon: Settings,
        description: "Configure referral automation rules",
      },
    ],
  },
  {
    title: "Performance Evaluations",
    href: "/evaluations",
    icon: TrendingUp,
    description: "Comprehensive staff performance assessment system",
    children: [
      {
        title: "Self Evaluation",
        href: "/self-evaluation",
        icon: PenTool,
        description: "Staff self-assessment portal",
      },
      {
        title: "Competency Assessment",
        href: "/staff-competency",
        icon: ShieldIcon,
        description: "Skills and knowledge validation (Can they do the job?)",
      },
      {
        title: "Review & Approval",
        href: "/competency-reviews",
        icon: CheckCircle,
        description: "Supervisor review and approval of evaluations",
      },
    ],
  },
  {
    title: "Scheduling",
    href: "/schedule",
    icon: CalendarIcon,
    description: "Staff scheduling and time management",
  },
  {
    title: "Communications",
    href: "/communications",
    icon: MessageSquare,
    description: "Internal messaging and notifications",
  },
  {
    title: "Training Center",
    href: "/training",
    icon: GraduationCap,
    description: "Staff education and development programs",
    children: [
      {
        title: "Continuing Education",
        href: "/continuing-education",
        icon: BookOpen,
        description: "CE tracking and compliance management",
      },
      {
        title: "In-Service Training",
        href: "/in-service",
        icon: Award,
        description: "Internal training programs and assignments",
      },
    ],
  },
  {
    title: "Quality Assurance",
    href: "/quality",
    icon: Activity,
    description: "Quality monitoring and improvement tools",
    children: [
      {
        title: "OASIS QA",
        href: "/oasis-qa",
        icon: FileCheck,
        description: "OASIS assessment quality assurance",
      },
      {
        title: "Survey Ready",
        href: "/survey-ready",
        icon: ClipboardCheck,
        description: "Survey preparation and compliance tools",
      },
    ],
  },
  {
    title: "Clinical Tools",
    href: "/nurse-scanner",
    icon: StethoscopeIcon,
    description: "Clinical support and medication management",
    children: [
      {
        title: "Medication Scanner",
        href: "/nurse-scanner",
        icon: Scan,
        description: "Barcode scanning for medication verification",
      },
      {
        title: "Wound Care Supplies",
        href: "/wound-care-supplies",
        icon: PackageIcon,
        description: "Supply tracking and cost analysis",
      },
    ],
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    description: "Performance metrics and business intelligence",
    children: [
      {
        title: "Star Rating Dashboard",
        href: "/employer-dashboard",
        icon: StarIcon,
        description: "Medicare Star Ratings monitoring and improvement",
      },
      {
        title: "Predictive Analytics",
        href: "/predictive-analytics",
        icon: BrainIcon,
        description: "AI-powered insights and forecasting",
      },
    ],
  },
  {
    title: "Patient Portal",
    href: "/patient-portal",
    icon: UserCheck,
    description: "Patient engagement and communication tools",
  },
  {
    title: "Integrations",
    href: "/integrations",
    icon: Database,
    description: "Third-party system integrations and API management",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "System configuration and preferences",
  },
]

interface MainNavigationProps {
  className?: string
}

export function MainNavigation({ className }: MainNavigationProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex flex-col space-y-1", className)}>
      {navigationItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
        const Icon = item.icon

        return (
          <div key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>

            {/* Show children if parent is active */}
            {item.children && isActive && (
              <div className="ml-6 mt-1 space-y-1">
                {item.children.map((child) => {
                  const isChildActive = pathname === child.href
                  const ChildIcon = child.icon

                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                        isChildActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground",
                      )}
                    >
                      <ChildIcon className="h-3 w-3" />
                      <span>{child.title}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
