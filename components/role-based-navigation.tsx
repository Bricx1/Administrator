"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Menu,
  Home,
  Users,
  FileText,
  Calendar,
  MessageSquare,
  Settings,
  Bell,
  User,
  LogOut,
  GraduationCap,
  Shield,
  FileCheck,
  Stethoscope,
  Heart,
  Building2,
  Star,
  Award,
  TrendingUp,
  BarChart3,
  Database,
  Bot,
  Activity,
  ClipboardCheck,
  BookOpen,
  UserCheck,
  Workflow,
  AlertTriangle,
  Send,
  Plus,
  Crown,
  Eye,
  Brain,
  Target,
  PenTool,
} from "lucide-react"
import { getCurrentUser } from "@/lib/auth"

interface NavigationItem {
  title: string
  href: string
  icon: any
  badge?: string | null
  requiredPermission?: { resource: string; action: string }
  roles?: string[]
}

const allNavigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
    requiredPermission: { resource: "dashboard", action: "read" },
  },
  {
    title: "Survey Dashboard",
    href: "/survey-ready",
    icon: Eye,
    badge: "Survey",
    requiredPermission: { resource: "survey", action: "read" },
    roles: ["survey_user"],
  },
  {
    title: "Applications",
    href: "/applications",
    icon: FileText,
    badge: "12",
    requiredPermission: { resource: "applications", action: "read" },
  },
  {
    title: "Staff Management",
    href: "/staff-dashboard",
    icon: Users,
    requiredPermission: { resource: "staff", action: "read" },
  },
  {
    title: "Staff Competency",
    href: "/staff-competency",
    icon: Brain,
    badge: "AI",
    requiredPermission: { resource: "staff", action: "read" },
    roles: ["super_admin", "admin", "qa_director", "qa_nurse", "clinical_director", "nurse_manager"],
  },
  {
    title: "Performance Analytics",
    href: "/performance-analytics",
    icon: BarChart3,
    badge: "New",
    requiredPermission: { resource: "analytics", action: "read" },
    roles: ["super_admin", "admin", "qa_director", "hr_director", "clinical_director"],
  },
  {
    title: "Self Evaluation",
    href: "/self-evaluation",
    icon: PenTool,
    badge: "Self",
    requiredPermission: { resource: "staff", action: "read" },
    roles: ["staff_nurse", "nurse_manager", "clinical_director", "qa_nurse", "qa_director"],
  },
  {
    title: "Competency Reviews",
    href: "/competency-reviews",
    icon: Target,
    badge: "Review",
    requiredPermission: { resource: "qa", action: "read" },
    roles: ["super_admin", "admin", "qa_director", "qa_nurse", "clinical_director", "nurse_manager"],
  },
  {
    title: "Scheduling",
    href: "/schedule",
    icon: Calendar,
    badge: "3",
    requiredPermission: { resource: "schedule", action: "read" },
  },
  {
    title: "Communications",
    href: "/communications",
    icon: MessageSquare,
    requiredPermission: { resource: "dashboard", action: "read" },
  },
  {
    title: "Training Center",
    href: "/training",
    icon: GraduationCap,
    badge: "New",
    requiredPermission: { resource: "training", action: "read" },
  },
  {
    title: "Quality Assurance",
    href: "/quality",
    icon: Shield,
    requiredPermission: { resource: "qa", action: "read" },
    roles: ["super_admin", "admin", "qa_director", "qa_nurse", "clinical_director"],
  },
  {
    title: "Document Verification",
    href: "/documents",
    icon: FileCheck,
    badge: "5",
    requiredPermission: { resource: "hr", action: "read" },
  },
  {
    title: "Digital Signatures",
    href: "/signatures",
    icon: FileCheck,
    requiredPermission: { resource: "hr", action: "read" },
  },
  {
    title: "Survey Ready",
    href: "/survey-ready",
    icon: Award,
    badge: "Hot",
    requiredPermission: { resource: "qa", action: "read" },
    roles: ["super_admin", "admin", "qa_director", "clinical_director"],
  },
  {
    title: "OASIS QA",
    href: "/oasis-qa",
    icon: Stethoscope,
    badge: "AI",
    requiredPermission: { resource: "qa", action: "read" },
    roles: ["super_admin", "admin", "qa_director", "qa_nurse", "clinical_director"],
  },
  {
    title: "OASIS Upload",
    href: "/oasis-upload",
    icon: FileText,
    badge: "New",
    requiredPermission: { resource: "qa", action: "write" },
    roles: ["super_admin", "admin", "qa_director", "qa_nurse", "clinical_director"],
  },
  {
    title: "Order Management",
    href: "/order-management",
    icon: ClipboardCheck,
    badge: "Sync",
    requiredPermission: { resource: "patient", action: "read" },
    roles: ["super_admin", "admin", "qa_director", "qa_nurse", "clinical_director", "nurse_manager"],
  },
  {
    title: "Predictive Analytics",
    href: "/predictive-analytics",
    icon: TrendingUp,
    badge: "Beta",
    requiredPermission: { resource: "analytics", action: "read" },
    roles: ["super_admin", "admin", "qa_director", "hr_director", "clinical_director"],
  },
  {
    title: "Analytics Dashboard",
    href: "/analytics",
    icon: BarChart3,
    requiredPermission: { resource: "analytics", action: "read" },
    roles: ["super_admin", "admin", "qa_director", "hr_director", "clinical_director"],
  },
  {
    title: "Integrations",
    href: "/integrations",
    icon: Database,
    requiredPermission: { resource: "system", action: "read" },
    roles: ["super_admin", "admin"],
  },
  {
    title: "Workflows",
    href: "/workflows",
    icon: Workflow,
    requiredPermission: { resource: "system", action: "read" },
    roles: ["super_admin", "admin"],
  },
  {
    title: "Complaints",
    href: "/complaints",
    icon: AlertTriangle,
    badge: "2",
    requiredPermission: { resource: "hr", action: "read" },
  },
  {
    title: "Leave Requests",
    href: "/leave-requests",
    icon: Calendar,
    requiredPermission: { resource: "hr", action: "read" },
    roles: ["super_admin", "admin", "hr_director", "hr_specialist"],
  },
  {
    title: "HR Files",
    href: "/hr-files",
    icon: FileText,
    requiredPermission: { resource: "hr", action: "read" },
    roles: ["super_admin", "admin", "hr_director", "hr_specialist"],
  },
  {
    title: "Patient Reviews",
    href: "/patient-reviews",
    icon: Star,
    requiredPermission: { resource: "patient", action: "read" },
  },
  {
    title: "Nurse Scanner",
    href: "/nurse-scanner",
    icon: Bot,
    badge: "AI",
    requiredPermission: { resource: "patient", action: "read" },
    roles: ["super_admin", "admin", "clinical_director", "nurse_manager", "staff_nurse"],
  },
  {
    title: "Wound Care Supplies",
    href: "/wound-care-supplies",
    icon: Activity,
    requiredPermission: { resource: "patient", action: "read" },
    roles: ["super_admin", "admin", "clinical_director", "nurse_manager", "staff_nurse"],
  },
  {
    title: "Continuing Education",
    href: "/continuing-education",
    icon: BookOpen,
    requiredPermission: { resource: "training", action: "read" },
  },
  {
    title: "In-Service Training",
    href: "/in-service",
    icon: UserCheck,
    requiredPermission: { resource: "training", action: "read" },
  },
  {
    title: "Physician Management",
    href: "/physicians",
    icon: Stethoscope,
    requiredPermission: { resource: "staff", action: "read" },
    roles: ["super_admin", "admin", "clinical_director"],
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: Crown,
    badge: "Admin",
    requiredPermission: { resource: "system", action: "read" },
    roles: ["super_admin", "admin"],
  },
]

const quickActions = [
  {
    title: "New Application",
    href: "/applications",
    icon: Plus,
    color: "bg-blue-500",
    requiredPermission: { resource: "applications", action: "write" },
  },
  {
    title: "Schedule Visit",
    href: "/schedule",
    icon: Calendar,
    color: "bg-green-500",
    requiredPermission: { resource: "schedule", action: "write" },
  },
  {
    title: "QA Review",
    href: "/quality",
    icon: ClipboardCheck,
    color: "bg-purple-500",
    requiredPermission: { resource: "qa", action: "read" },
  },
  {
    title: "Send Message",
    href: "/communications",
    icon: Send,
    color: "bg-orange-500",
    requiredPermission: { resource: "dashboard", action: "read" },
  },
]

export function RoleBasedNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const currentUser = getCurrentUser() // In real app, this would come from auth context

  const hasPermission = (resource: string, action: string): boolean => {
    return currentUser.permissions.some(
      (permission) => permission.resource === resource && permission.actions.includes(action),
    )
  }

  const canAccessItem = (item: NavigationItem): boolean => {
    // Check role-based access
    if (item.roles && !item.roles.includes(currentUser.role.id)) {
      return false
    }

    // Check permission-based access
    if (item.requiredPermission) {
      return hasPermission(item.requiredPermission.resource, item.requiredPermission.action)
    }

    return true
  }

  // Filter navigation items based on user role and permissions
  let navigationItems = allNavigationItems.filter(canAccessItem)

  // Special handling for survey users - only show survey-related items
  if (currentUser.role.id === "survey_user") {
    navigationItems = navigationItems.filter(
      (item) => item.href === "/survey-ready" || item.requiredPermission?.resource === "survey",
    )
  }

  const availableQuickActions = quickActions.filter((action) =>
    hasPermission(action.requiredPermission.resource, action.requiredPermission.action),
  )

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const getRoleColor = () => {
    switch (currentUser.role.level) {
      case 100:
        return "text-red-600 bg-red-100"
      case 90:
        return "text-purple-600 bg-purple-100"
      case 80:
        return "text-blue-600 bg-blue-100"
      case 75:
        return "text-indigo-600 bg-indigo-100"
      case 70:
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getRoleIcon = () => {
    if (currentUser.role.level === 100) return <Crown className="h-3 w-3" />
    if (currentUser.role.id === "survey_user") return <Eye className="h-3 w-3" />
    if (currentUser.role.level >= 80) return <Shield className="h-3 w-3" />
    return <Users className="h-3 w-3" />
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Building2 className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">M.A.S.E Pro</span>
          </div>

          {/* User Role Badge */}
          <div className="px-4 mt-4">
            <Badge className={`${getRoleColor()} text-xs`}>
              <div className="flex items-center space-x-1">
                {getRoleIcon()}
                <span>{currentUser.role.name}</span>
              </div>
            </Badge>
          </div>

          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? "bg-indigo-100 text-indigo-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        isActive(item.href) ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    />
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <Badge
                        variant={
                          item.badge === "New" ||
                          item.badge === "Hot" ||
                          item.badge === "AI" ||
                          item.badge === "Beta" ||
                          item.badge === "Admin" ||
                          item.badge === "Survey" ||
                          item.badge === "Self" ||
                          item.badge === "Review"
                            ? "default"
                            : "secondary"
                        }
                        className="ml-2 text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Patient Portal Section - Only for clinical roles */}
            {(currentUser.role.id === "super_admin" ||
              currentUser.role.id === "admin" ||
              currentUser.role.id === "clinical_director" ||
              currentUser.role.id === "nurse_manager" ||
              currentUser.role.id === "staff_nurse") && (
              <div className="px-2 mt-6 pt-6 border-t border-gray-200">
                <div className="mb-3">
                  <p className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient Services</p>
                </div>
                <Link
                  href="/patient-portal"
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-rose-600 hover:bg-rose-50 hover:text-rose-900 transition-colors"
                >
                  <Heart className="mr-3 flex-shrink-0 h-5 w-5 text-rose-400 group-hover:text-rose-500" />
                  <span className="flex-1">Patient Portal</span>
                  <Badge variant="outline" className="ml-2 text-xs border-rose-200 text-rose-600">
                    Portal
                  </Badge>
                </Link>
              </div>
            )}

            {/* Quick Actions - Hide for survey users */}
            {currentUser.role.id !== "survey_user" && availableQuickActions.length > 0 && (
              <div className="px-2 mt-6 pt-6 border-t border-gray-200">
                <div className="mb-3">
                  <p className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Actions</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {availableQuickActions.map((action) => {
                    const Icon = action.icon
                    return (
                      <Link
                        key={action.href}
                        href={action.href}
                        className="flex flex-col items-center p-3 text-xs font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <div className={`p-2 rounded-md ${action.color} text-white mb-1`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-center">{action.title}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Login Buttons - Hide for survey users */}
            {currentUser.role.id !== "survey_user" && (
              <div className="px-2 mt-6 pt-6 border-t border-gray-200 space-y-2">
                <Link href="/login" className="w-full">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <User className="h-4 w-4 mr-2" />
                    Staff Login
                  </Button>
                </Link>
                <Link href="/auth/patient-login" className="w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start border-rose-200 text-rose-600 hover:bg-rose-50 bg-transparent"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Patient Login
                  </Button>
                </Link>
                <Link href="/survey-login" className="w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start border-indigo-200 text-indigo-600 hover:bg-indigo-50 bg-transparent"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Survey Access
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">M.A.S.E Pro</span>
          </div>

          <div className="flex items-center space-x-2">
            <Badge className={`${getRoleColor()} text-xs`}>
              <div className="flex items-center space-x-1">
                {getRoleIcon()}
                <span>{currentUser.role.name}</span>
              </div>
            </Badge>

            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div>
                    <div className="font-medium">{currentUser.name}</div>
                    <div className="text-sm text-gray-500">{currentUser.role.name}</div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center">
                    <Building2 className="h-6 w-6 text-indigo-600 mr-2" />
                    M.A.S.E Pro
                  </SheetTitle>
                  <SheetDescription>
                    <div className="flex items-center space-x-2">
                      <span>Logged in as:</span>
                      <Badge className={`${getRoleColor()} text-xs`}>
                        <div className="flex items-center space-x-1">
                          {getRoleIcon()}
                          <span>{currentUser.role.name}</span>
                        </div>
                      </Badge>
                    </div>
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 flex flex-col space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive(item.href)
                            ? "bg-indigo-100 text-indigo-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <Icon className={`mr-3 h-5 w-5 ${isActive(item.href) ? "text-indigo-500" : "text-gray-400"}`} />
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <Badge
                            variant={
                              item.badge === "New" ||
                              item.badge === "Hot" ||
                              item.badge === "AI" ||
                              item.badge === "Beta" ||
                              item.badge === "Admin" ||
                              item.badge === "Survey" ||
                              item.badge === "Self" ||
                              item.badge === "Review"
                                ? "default"
                                : "secondary"
                            }
                            className="ml-2 text-xs"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </>
  )
}
