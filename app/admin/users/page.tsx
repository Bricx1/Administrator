"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Shield,
  Settings,
  Search,
  UserCheck,
  UserX,
  Crown,
  AlertTriangle,
  Eye,
  Building2,
} from "lucide-react"
import { type User, type UserRole, type Permission, USER_ROLES } from "@/lib/auth"

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("users")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Mock users data
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      email: "admin@irishtripletshealth.com",
      name: "System Administrator",
      role: USER_ROLES.SUPER_ADMIN,
      permissions: USER_ROLES.SUPER_ADMIN.permissions,
      isActive: true,
      lastLogin: new Date("2024-01-22T10:30:00"),
    },
    {
      id: "2",
      email: "qa.director@irishtripletshealth.com",
      name: "Sarah Johnson",
      role: USER_ROLES.QA_DIRECTOR,
      permissions: USER_ROLES.QA_DIRECTOR.permissions,
      department: "Quality Assurance",
      isActive: true,
      lastLogin: new Date("2024-01-22T09:15:00"),
    },
    {
      id: "3",
      email: "hr.director@irishtripletshealth.com",
      name: "Michael Rodriguez",
      role: USER_ROLES.HR_DIRECTOR,
      permissions: USER_ROLES.HR_DIRECTOR.permissions,
      department: "Human Resources",
      isActive: true,
      lastLogin: new Date("2024-01-21T16:45:00"),
    },
    {
      id: "4",
      email: "qa.nurse@irishtripletshealth.com",
      name: "Jennifer Martinez",
      role: USER_ROLES.QA_NURSE,
      permissions: USER_ROLES.QA_NURSE.permissions,
      department: "Quality Assurance",
      isActive: true,
      lastLogin: new Date("2024-01-22T08:00:00"),
    },
    {
      id: "5",
      email: "nurse.manager@irishtripletshealth.com",
      name: "David Thompson",
      role: USER_ROLES.NURSE_MANAGER,
      permissions: USER_ROLES.NURSE_MANAGER.permissions,
      department: "Clinical",
      isActive: false,
      lastLogin: new Date("2024-01-20T14:30:00"),
    },
    {
      id: "6",
      email: "surveyor@state.gov",
      name: "State Surveyor - J. Smith",
      role: USER_ROLES.SURVEY_USER,
      permissions: USER_ROLES.SURVEY_USER.permissions,
      organization: "State Health Department",
      isActive: true,
      lastLogin: new Date("2024-01-22T14:00:00"),
    },
  ])

  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    role: "",
    department: "",
    organization: "",
    permissions: [] as Permission[],
    isActive: true,
  })

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || user.role.id === selectedRole
    return matchesSearch && matchesRole
  })

  const getRoleColor = (role: UserRole) => {
    switch (role.level) {
      case 100:
        return "bg-red-100 text-red-800"
      case 90:
        return "bg-purple-100 text-purple-800"
      case 80:
        return "bg-blue-100 text-blue-800"
      case 75:
        return "bg-indigo-100 text-indigo-800"
      case 70:
        return "bg-green-100 text-green-800"
      case 60:
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleIcon = (role: UserRole) => {
    if (role.level === 100) return <Crown className="h-4 w-4" />
    if (role.id === "survey_user") return <Eye className="h-4 w-4" />
    if (role.level >= 80) return <Shield className="h-4 w-4" />
    if (role.level >= 60) return <UserCheck className="h-4 w-4" />
    return <Users className="h-4 w-4" />
  }

  const handleCreateUser = () => {
    const selectedRole = Object.values(USER_ROLES).find((role) => role.id === newUser.role)
    if (!selectedRole) return

    const user: User = {
      id: Date.now().toString(),
      email: newUser.email,
      name: newUser.name,
      role: selectedRole,
      permissions: newUser.permissions.length > 0 ? newUser.permissions : selectedRole.permissions,
      department: newUser.department,
      organization: newUser.organization,
      isActive: newUser.isActive,
    }

    setUsers([...users, user])
    setNewUser({
      email: "",
      name: "",
      role: "",
      department: "",
      organization: "",
      permissions: [],
      isActive: true,
    })
    setIsCreateUserOpen(false)
  }

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, isActive: !user.isActive } : user)))
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage user accounts, roles, and permissions</p>
        </div>
        <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>Add a new user to the system with appropriate permissions</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(USER_ROLES).map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          <div className="flex items-center space-x-2">
                            {getRoleIcon(role)}
                            <span>{role.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="department">Department/Organization</Label>
                  <Input
                    id="department"
                    value={newUser.role === "survey_user" ? newUser.organization : newUser.department}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        ...(newUser.role === "survey_user"
                          ? { organization: e.target.value }
                          : { department: e.target.value }),
                      })
                    }
                    placeholder={newUser.role === "survey_user" ? "Enter organization" : "Enter department"}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={newUser.isActive}
                  onCheckedChange={(checked) => setNewUser({ ...newUser, isActive: checked })}
                />
                <Label>Active User</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateUserOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateUser}>Create User</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.filter((u) => u.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Crown className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Administrators</p>
                <p className="text-2xl font-bold text-gray-900">{users.filter((u) => u.role.level >= 90).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Eye className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Survey Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter((u) => u.role.id === "survey_user").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <UserX className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactive Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.filter((u) => !u.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Accounts</CardTitle>
                  <CardDescription>Manage user accounts and their access levels</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {Object.values(USER_ROLES).map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department/Organization</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          <div className="flex items-center space-x-1">
                            {getRoleIcon(user.role)}
                            <span>{user.role.name}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {user.role.id === "survey_user" && <Building2 className="h-4 w-4 text-gray-400" />}
                          <span>{user.organization || user.department || "-"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? "default" : "secondary"}>
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin ? user.lastLogin.toLocaleDateString() : "Never"}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user)
                              setIsEditUserOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleToggleUserStatus(user.id)}>
                            {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </Button>
                          {user.role.level < 100 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(USER_ROLES).map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(role)}
                      <CardTitle className="text-lg">{role.name}</CardTitle>
                    </div>
                    <Badge className={getRoleColor(role)}>Level {role.level}</Badge>
                  </div>
                  {role.defaultRoute && <CardDescription>Default route: {role.defaultRoute}</CardDescription>}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Permissions ({role.permissions.length})</Label>
                      <div className="mt-2 space-y-1">
                        {role.permissions.slice(0, 5).map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>{permission.name}</span>
                          </div>
                        ))}
                        {role.permissions.length > 5 && (
                          <div className="text-sm text-gray-500">+{role.permissions.length - 5} more permissions</div>
                        )}
                      </div>
                    </div>
                    <div className="pt-2">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure Role
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>Track user activities and system changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    user: "System Administrator",
                    action: "Created survey user account",
                    target: "surveyor@state.gov",
                    timestamp: "2024-01-22 14:30:00",
                    type: "create",
                  },
                  {
                    id: 2,
                    user: "System Administrator",
                    action: "Updated user permissions",
                    target: "jennifer.martinez@irishtripletshealth.com",
                    timestamp: "2024-01-22 10:30:00",
                    type: "update",
                  },
                  {
                    id: 3,
                    user: "HR Director",
                    action: "Updated user permissions",
                    target: "david.thompson@irishtripletshealth.com",
                    timestamp: "2024-01-22 09:15:00",
                    type: "update",
                  },
                  {
                    id: 4,
                    user: "System Administrator",
                    action: "Deactivated user account",
                    target: "former.employee@irishtripletshealth.com",
                    timestamp: "2024-01-21 16:45:00",
                    type: "deactivate",
                  },
                  {
                    id: 5,
                    user: "Survey User - J. Smith",
                    action: "Accessed survey dashboard",
                    target: "Survey Ready Portal",
                    timestamp: "2024-01-22 14:00:00",
                    type: "access",
                  },
                ].map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-2 rounded-lg ${
                          log.type === "create"
                            ? "bg-green-100"
                            : log.type === "update"
                              ? "bg-blue-100"
                              : log.type === "access"
                                ? "bg-purple-100"
                                : "bg-red-100"
                        }`}
                      >
                        {log.type === "create" ? (
                          <Plus className="h-4 w-4 text-green-600" />
                        ) : log.type === "update" ? (
                          <Edit className="h-4 w-4 text-blue-600" />
                        ) : log.type === "access" ? (
                          <Eye className="h-4 w-4 text-purple-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{log.action}</p>
                        <p className="text-sm text-gray-600">
                          by {log.user} • Target: {log.target}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{log.timestamp}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
