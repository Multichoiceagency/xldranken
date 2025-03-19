
import { AccountDetailsPage } from "@/components/account/account-details-page"
import {Suspense} from "react";

export default function AccountDetails() {
  return (
       <Suspense fallback={<div>Loading...</div>}>
         <AccountDetailsPage />
       </Suspense>
  )
}

