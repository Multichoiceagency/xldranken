import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getCustomerOrder } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import OrderButton from "@/components/account/OrderButton"
import { formatDate, formatCurrency } from "@/lib/utils"

interface Order {
  clcleunik: string
  date: string
  confirmation_date: string
  totalTVAC: string
  guid: string
}

export default async function Orders() {
  // Get the session info on the server side
  const session = await getServerSession(authOptions)

  // If no session, display an error
  if (!session || !session.user) {
    return <p className="text-red-500">Je moet ingelogd zijn om je bestellingen te bekijken.</p>
  }

  // Fetch the order data
  const orderData: Order[] = await getCustomerOrder(session.user.clcleunik)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mijn Bestellingen</h1>
      <Card className="p-6">
        {orderData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Je hebt nog geen bestellingen geplaatst.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bestelnummer</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Bevestigingsdatum</TableHead>
                <TableHead>Totaal</TableHead>
                <TableHead className="text-right">Actie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderData.map((order) => (
                <TableRow key={order.clcleunik}>
                  <TableCell className="font-medium">{order.clcleunik}</TableCell>
                  <TableCell>{order.date ? formatDate(order.date) : "-"}</TableCell>
                  <TableCell>
                    {order.confirmation_date ? formatDate(order.confirmation_date) : "Geen bevestiging"}
                  </TableCell>
                  <TableCell>{formatCurrency(Number.parseFloat(order.totalTVAC || "0"))}</TableCell>
                  <TableCell className="text-right">
                    {/* Pass the order GUID and order number to the client component */}
                    <OrderButton orderGuid={order.guid} orderNumber={order.clcleunik} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
