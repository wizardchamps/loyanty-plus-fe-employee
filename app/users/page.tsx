"use client"

import { useState } from "react"
import { Users, CalendarDays, Mail, Phone, TrendingUp } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define the User type
type User = {
  id: string
  phoneNumber: string
  email: string
  lastAccess: string // Date string
  pointsEarned: number
}

// Dummy data for demonstration
const dummyUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: `user-${i + 1}`,
  phoneNumber: `+1 (555) ${String(1000 + i).padStart(4, '0')}`,
  email: `user${i + 1}@example.com`,
  lastAccess: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
  pointsEarned: Math.floor(Math.random() * 1000) + 10,
}))

export default function UserManagementPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const totalPages = Math.ceil(dummyUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = dummyUsers.slice(startIndex, endIndex)

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1) // Reset to first page when items per page changes
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F3FF] to-[#EDE9FE] dark:from-background dark:to-background pb-20 md:pb-8">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            User Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            View and manage your loyalty program users
          </p>
        </div>

        {/* User List Table */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]"><Phone className="inline-block h-4 w-4 mr-2 text-muted-foreground" />Phone Number</TableHead>
                <TableHead><Mail className="inline-block h-4 w-4 mr-2 text-muted-foreground" />Email</TableHead>
                <TableHead className="hidden md:table-cell"><CalendarDays className="inline-block h-4 w-4 mr-2 text-muted-foreground" />Last Access</TableHead>
                <TableHead className="text-right"><TrendingUp className="inline-block h-4 w-4 mr-2 text-muted-foreground" />Points Earned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.phoneNumber}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{user.lastAccess}</TableCell>
                  <TableCell className="text-right">{user.pointsEarned}</TableCell>
                </TableRow>
              ))}
              {currentUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between p-4 border-t border-border flex-wrap gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Rows per page:
              <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="w-[70px] h-8">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
