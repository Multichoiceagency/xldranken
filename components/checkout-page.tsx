'use client'

import {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {ArrowLeft, Info} from 'lucide-react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Checkbox} from "@/components/ui/checkbox";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useCart} from "@/lib/cart-context";
import {PaymentMethodsPage} from "./payment-methods-page";
import {createEmptyORder, getCustomerById, handleOrders} from "@/lib/api";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

const getDeliveryDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip Sundays & Saturdays
            dates.push({
                day: date.toLocaleDateString('nl-NL', {weekday: 'short'}),
                date: date.toLocaleDateString('nl-NL', {day: 'numeric', month: 'short'})
            });
        }
    }
    return dates;
};

const deliveryDates = getDeliveryDates();

const deliveryTimes = [
    {label: 'Standaard levering (+ € 0.00)', value: 'standard'},
    {label: 'Ochtend (+ € 2.00)', value: 'morning'},
    {label: 'Middag (+ € 2.00)', value: 'afternoon'},
    {label: 'Avond (+ € 2.00)', value: 'evening'},
];

export default function CheckoutPage({ customerData }: any) {
    const [step, setStep] = useState<'delivery' | 'payment'>('delivery');
    const [deliveryOption, setDeliveryOption] = useState<"delivery" | "pickup">("delivery");
    const [selectedDate, setSelectedDate] = useState(deliveryDates[0]);
    const [differentBillingAddress, setDifferentBillingAddress] = useState(false);
    const { cart, getCartTotal } = useCart();
    const { totalPrice } = getCartTotal();
    const shippingCost = deliveryOption === "delivery" ? 4.95 : 0;
    const subtotal = totalPrice;
    const total = subtotal + shippingCost;


    // console.log(session)

    const handleContinue = () => handleOrders(cart, customerData);
    const handleBack = () => setStep('delivery');
    const handleComplete = () => console.log('Checkout completed');

    if (step === 'payment') {
        return <PaymentMethodsPage onBack={handleBack} onComplete={handleComplete}/>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 space-y-8">
                        <nav className="flex gap-8 border-b">
                            <button className="font-medium text-primary border-b-2 border-primary pb-4">
                                Bezorging
                            </button>
                            <button className="font-medium text-gray-400 pb-4">
                                Betaalmethode
                            </button>
                        </nav>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h1 className="text-2xl font-bold mb-6">BEZORGING</h1>

                            <RadioGroup defaultValue="delivery"
                                        onValueChange={(value) => setDeliveryOption(value as "delivery" | "pickup")}>
                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <RadioGroupItem value="delivery" id="delivery" className="mt-1"/>
                                        <div className="ml-3 flex-1">
                                            <Label htmlFor="delivery" className="font-medium">Bezorgen</Label>
                                            <div className="text-right text-primary font-medium">€ 4,95</div>

                                            {deliveryOption === "delivery" && (
                                                <div className="mt-4 space-y-4">
                                                    <div>
                                                        <Label>MIJN ADRES</Label>
                                                        <Input defaultValue={customerData?.firstName || ""}
                                                               placeholder="Naam" className="mt-1"/>
                                                        <Input defaultValue={customerData?.address || ""}
                                                               placeholder="Straat en huisnummer" className="mt-2"/>
                                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                                            <Input defaultValue={customerData?.zipcode || ""}
                                                                   placeholder="Postcode"/>
                                                            <Input defaultValue={customerData?.city || ""}
                                                                   placeholder="Plaats"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>

                    <div className="lg:w-[400px]">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="font-bold mb-4">JOUW OVERZICHT</h2>
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex justify-between">
                                        <span>{item.quantity} × {item.name}</span>
                                        <span>€ {(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between font-bold pt-4 border-t">
                                    <span>Totaal</span>
                                    <span>€ {total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Button className="bg-[#FF6B35] hover:bg-[#E85A24] text-white min-w-[200px]" onClick={handleContinue}>
                    DOORGAAN
                </Button>
            </div>
        </div>
    );
}
