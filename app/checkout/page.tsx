import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getCustomerById } from "@/lib/api";
import CheckoutPage from "@/components/checkout-page";

export default async function Checkout() {
    const session = await getServerSession(authOptions);

    let customerData = null;
    if (session?.user?.clcleunik) {
        customerData = await getCustomerById(String(session.user.clcleunik));
    }

    return <CheckoutPage customerData={customerData} />;
}