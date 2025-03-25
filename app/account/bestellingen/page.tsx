import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getCustomerOrder } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import OrderButton from "@/components/account/OrderButton"; // Importing the client component

interface Order {
  clcleunik: string;
  date: string;
  confirmation_date: string;
  totalTVAC: string;
  guid: string;
}

export default async function Orders() {
  // Get the session info on the server side
  const session = await getServerSession(authOptions);

  // If no session, display an error
  if (!session || !session.user) {
    return <p className="text-red-500">Je moet ingelogd zijn om je bestellingen te bekijken.</p>;
  }

  // Fetch the order data
  const orderData: Order[] = await getCustomerOrder(session.user.clcleunik);

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
          {orderData.map((order) => (
            <TableRow key={order.clcleunik}>
              <TableCell>{order.clcleunik}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>{order.confirmation_date || "Geen bevestiging"}</TableCell>
              <TableCell>€{order.totalTVAC}</TableCell>
              <TableCell>
                {/* Pass the order GUID to the client component */}
                <OrderButton orderGuid={order.guid} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
