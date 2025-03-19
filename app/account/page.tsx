import { Suspense } from "react";
import { AccountPage } from "@/components/account-page"; // Move the logic to a Client Component

export default function Account() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountPage />
    </Suspense>
  );
}
