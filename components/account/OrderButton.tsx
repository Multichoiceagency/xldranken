"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { getCustomerOrderDetails } from "@/lib/api"; // Ensure this is the correct path to your API function

interface OrderButtonProps {
  orderGuid: string;
}

export default function OrderButton({ orderGuid }: OrderButtonProps) {
  const [loading, setLoading] = useState(false);

  // Function to handle the "View Order" button click
  const handleViewOrder = async () => {
    setLoading(true);
    try {
      const details = await getCustomerOrderDetails(orderGuid);
      console.log("Order Details:", details); // Handle the details (e.g., show them in a modal or redirect)
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleViewOrder} disabled={loading}>
      <Eye className="h-4 w-4 mr-2" />
      {loading ? "Laden..." : "Bekijken"}
    </Button>
  );
}
