import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getCustomerOrder } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { OrdersTableWithProducts } from "@/components/orders-table-with-products"

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
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <p className="text-red-500">Je moet ingelogd zijn om je bestellingen te bekijken.</p>
        </Card>
      </div>
    )
  }

  // Check if clcleunik exists
  if (!session.user.clcleunik) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <p className="text-red-500">Er is een probleem met je account. Neem contact op met de klantenservice.</p>
        </Card>
      </div>
    )
  }

  // Now TypeScript knows clcleunik is definitely a string
  const orderData: Order[] = await getCustomerOrder(session.user.clcleunik.toString())

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mijn Bestellingen</h1>
      <Card className="p-6 overflow-visible">
        {orderData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Je hebt nog geen bestellingen geplaatst.</div>
        ) : (
          <OrdersTableWithProducts orders={orderData} />
        )}
      </Card>
    </div>
  )
}
