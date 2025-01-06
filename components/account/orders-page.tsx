'use client'

import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye } from 'lucide-react'

const orders = [
  {
    id: "ORD-2024-001",
    date: "05-01-2024",
    status: "Afgeleverd",
    total: "€156,95",
  },
  {
    id: "ORD-2023-089",
    date: "28-12-2023",
    status: "In behandeling",
    total: "€89,50",
  },
]

export function OrdersPage() {
  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-6">Bestellingen</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bestelnummer</TableHead>
            <TableHead>Datum</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Totaal</TableHead>
            <TableHead>Actie</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{order.total}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Bekijken
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

