"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Customer {
  id: string
  customerNumber: string
  name: string
  email: string
  city: string
  country: string
  addedDate: string
  isTestUser: boolean
  password: string
}

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/customers")

      if (!response.ok) {
        throw new Error("Failed to fetch customers")
      }

      const data = await response.json()
      setCustomers(data.customers)
    } catch (err) {
      setError("Error loading customers. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const cleanAllTestUsers = async () => {
    const testUsers = customers.filter((customer) => customer.isTestUser)

    if (testUsers.length === 0) {
      toast({
        title: "No test users found",
        description: "There are no test users to clean.",
        variant: "default",
      })
      return
    }

    if (!confirm(`Are you sure you want to clean ${testUsers.length} test users?`)) {
      return
    }

    try {
      setLoading(true)

      for (const user of testUsers) {
        await fetch(`/api/account/clean-test-data?id=${user.id}`, {
          method: "POST",
        })
      }

      toast({
        title: "Success",
        description: `${testUsers.length} test users have been cleaned.`,
        variant: "default",
      })

      // Refresh the customer list
      fetchCustomers()
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to clean test users. Please try again.",
        variant: "destructive",
      })
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const cleanTestUser = async (id: string) => {
    if (!confirm("Are you sure you want to clean this test user?")) {
      return
    }

    try {
      const response = await fetch(`/api/account/clean-test-data?id=${id}`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to clean test user")
      }

      toast({
        title: "Success",
        description: "Test user has been cleaned successfully.",
        variant: "default",
      })

      // Refresh the customer list
      fetchCustomers()
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to clean test user. Please try again.",
        variant: "destructive",
      })
      console.error(err)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading customers...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  // Filter test users
  const testUsers = customers.filter((customer) => customer.isTestUser)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-[#D0C298]">Customer List</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchCustomers} className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="destructive" onClick={cleanAllTestUsers} disabled={testUsers.length === 0}>
            Clean All Test Users ({testUsers.length})
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer #</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Wachtwoord</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.customerNumber}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{`${customer.city || ""}, ${customer.country || ""}`.replace(", ", "")}</TableCell>
                  <TableCell>
                    {customer.isTestUser ? (
                      <Badge variant="destructive">Test User</Badge>
                    ) : (
                      <Badge variant="outline">Regular User</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {customer.isTestUser && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => cleanTestUser(customer.id)}
                        title="Clean test data"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

