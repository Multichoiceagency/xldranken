"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Bell, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function NotificationSender() {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [userId, setUserId] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSendNotification = async () => {
    if (!message.trim()) {
      toast({
        title: "Bericht is verplicht",
        description: "Voer een berichtinhoud in om te verzenden",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title || "XL Groothandel",
          message,
          userId: userId || undefined,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Melding verzonden",
          description: userId ? `Melding verzonden naar gebruiker ${userId}` : "Melding verzonden naar alle abonnees",
        })

        // Clear form
        setTitle("")
        setMessage("")
        setUserId("")
      } else {
        toast({
          title: "Fout bij verzenden",
          description: result.error || "Er is een fout opgetreden bij het verzenden van de melding",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending notification:", error)
      toast({
        title: "Fout bij verzenden",
        description: "Er is een onverwachte fout opgetreden",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Bell className="h-5 w-5 text-[#FF6B35]" />
        Push Notificaties Verzenden
      </h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Titel (optioneel)
          </label>
          <Input id="title" placeholder="XL Groothandel" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Bericht *
          </label>
          <Textarea
            id="message"
            placeholder="Voer het bericht in dat u wilt verzenden..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            required
          />
        </div>

        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
            Gebruiker ID (optioneel)
          </label>
          <Input
            id="userId"
            placeholder="Laat leeg om naar alle abonnees te sturen"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            Als u een specifieke gebruiker ID invoert, wordt de melding alleen naar die gebruiker verzonden. Anders
            wordt de melding naar alle geabonneerde gebruikers verzonden.
          </p>
        </div>

        <Button
          onClick={handleSendNotification}
          disabled={loading || !message.trim()}
          className="w-full bg-[#FF6B35] hover:bg-[#E85A24]"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verzenden...
            </>
          ) : (
            "Melding verzenden"
          )}
        </Button>
      </div>
    </div>
  )
}
