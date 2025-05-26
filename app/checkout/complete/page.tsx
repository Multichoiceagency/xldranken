"use client"

import CheckoutCompleteContent from "@/components/checkout-complete-content"

export default function Page({
  searchParams,
}: {
  searchParams: { orderNumber?: string; total?: string; emailSent?: string }
}) {
  return <CheckoutCompleteContent searchParams={searchParams} />
}
