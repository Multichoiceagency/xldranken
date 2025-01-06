'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Settings } from 'lucide-react'

const subaccounts = [
  {
    name: "Jan Janssen",
    email: "jan@bedrijf.nl",
    role: "Inkoper",
    status: "Actief",
  },
  {
    name: "Piet Peters",
    email: "piet@bedrijf.nl",
    role: "Manager",
    status: "Actief",
  },
]

export function SubAccountsPage() {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subaccounts</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nieuw subaccount
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Naam</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actie</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subaccounts.map((account) => (
            <TableRow key={account.email}>
              <TableCell>{account.name}</TableCell>
              <TableCell>{account.email}</TableCell>
              <TableCell>{account.role}</TableCell>
              <TableCell>{account.status}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Beheren
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

