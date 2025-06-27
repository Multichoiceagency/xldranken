"use client"

// Customer confirmation email template component
export function CustomerConfirmationTemplate({
  customerData,
  orderData,
  orderNumber,
}: {
  customerData: any
  orderData: any
  orderNumber: string
}) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6", color: "#333" }}>
      <div style={{ backgroundColor: "#f4f4f4", padding: "20px", textAlign: "center" }}>
        <h1>Bedankt voor uw bestelling!</h1>
      </div>

      <div style={{ padding: "20px" }}>
        <p>
          Beste {customerData.firstName} {customerData.lastName},
        </p>

        <p>Wij hebben uw bestelling succesvol ontvangen en bevestigen deze hierbij.</p>

        <div style={{ backgroundColor: "#f9f9f9", padding: "15px", margin: "20px 0" }}>
          <h3>Ordergegevens:</h3>
          <p>
            <strong>Bestelnummer:</strong> {orderNumber}
          </p>
          <p>
            <strong>Besteldatum:</strong> {new Date().toLocaleDateString("nl-NL")}
          </p>
          <p>
            <strong>Leveringsoptie:</strong> {orderData.deliveryOption === "1" ? "Bezorging" : "Afhalen"}
          </p>
          <p>
            <strong>Leveringsdatum:</strong> {orderData.deliveryDate}
          </p>
          <p>
            <strong>Leveringsadres:</strong> {orderData.deliveryAddress}
          </p>
          {orderData.deliveryComment && (
            <p>
              <strong>Opmerking:</strong> {orderData.deliveryComment}
            </p>
          )}
        </div>

        <h3>Bestelde producten:</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", margin: "20px 0" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2" }}>Product</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2" }}>Artikelcode</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2" }}>Aantal</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2" }}>Prijs</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2" }}>Totaal</th>
            </tr>
          </thead>
          <tbody>
            {orderData.items.map((item: any, index: number) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.name}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.arcleunik || item.id}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.quantity}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>€{item.price.toFixed(2)}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>€{(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ backgroundColor: "#f9f9f9", padding: "15px", margin: "20px 0" }}>
          <p>Subtotaal (excl. BTW): €{orderData.subtotalExclVAT.toFixed(2)}</p>
          <p>BTW: €{orderData.totalVatAmount.toFixed(2)}</p>
          <p>Verzendkosten: €{orderData.shippingCost.toFixed(2)}</p>
          <p style={{ fontWeight: "bold", fontSize: "1.2em" }}>
            Totaal (incl. BTW): €{orderData.totalInclVAT.toFixed(2)}
          </p>
        </div>

        <p>Wij zullen uw bestelling zo spoedig mogelijk verwerken en u op de hoogte houden van de status.</p>

        <p>
          Met vriendelijke groet,
          <br />
          Het Megawin Team
        </p>
      </div>
    </div>
  )
}

// Admin notification email template component
export function AdminNotificationTemplate({
  customerData,
  orderData,
  orderNumber,
}: {
  customerData: any
  orderData: any
  orderNumber: string
}) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6", color: "#333" }}>
      <div style={{ backgroundColor: "#e74c3c", color: "white", padding: "20px", textAlign: "center" }}>
        <h1>🚨 NIEUWE BESTELLING ONTVANGEN</h1>
      </div>

      <div style={{ padding: "20px" }}>
        <div style={{ backgroundColor: "#ffebee", borderLeft: "4px solid #e74c3c", padding: "15px", margin: "20px 0" }}>
          <h3>⚡ ACTIE VEREIST</h3>
          <p>Er is een nieuwe bestelling binnengekomen die verwerkt moet worden.</p>
        </div>

        <div style={{ backgroundColor: "#f9f9f9", padding: "15px", margin: "20px 0" }}>
          <h3>📋 Orderinformatie:</h3>
          <p>
            <strong>Bestelnummer:</strong> {orderNumber}
          </p>
          <p>
            <strong>Besteldatum:</strong> {new Date().toLocaleDateString("nl-NL")}{" "}
            {new Date().toLocaleTimeString("nl-NL")}
          </p>
          <p>
            <strong>Totaal aantal items:</strong> {orderData.totalItems}
          </p>
          <p>
            <strong>Totaalwaarde:</strong> €{orderData.totalInclVAT.toFixed(2)}
          </p>
        </div>

        <div style={{ backgroundColor: "#f9f9f9", padding: "15px", margin: "20px 0" }}>
          <h3>👤 Klantgegevens:</h3>
          <p>
            <strong>Naam:</strong> {customerData.firstName} {customerData.lastName}
          </p>
          <p>
            <strong>Email:</strong> {customerData.email}
          </p>
          <p>
            <strong>Klant ID:</strong> {customerData.clcleunik}
          </p>
          {customerData.phone && (
            <p>
              <strong>Telefoon:</strong> {customerData.phone}
            </p>
          )}
        </div>

        <div style={{ backgroundColor: "#f9f9f9", padding: "15px", margin: "20px 0" }}>
          <h3>🚚 Leveringsgegevens:</h3>
          <p>
            <strong>Leveringsoptie:</strong> {orderData.deliveryOption === "1" ? "🚚 Bezorging" : "🏪 Afhalen"}
          </p>
          <p>
            <strong>Gewenste leveringsdatum:</strong> {orderData.deliveryDate}
          </p>
          <p>
            <strong>Leveringsadres:</strong> {orderData.deliveryAddress}
          </p>
          {orderData.deliveryComment && (
            <p>
              <strong>Opmerking:</strong> {orderData.deliveryComment}
            </p>
          )}
        </div>

        <h3>📦 Bestelde producten:</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", margin: "20px 0" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2" }}>Artikelcode</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2" }}>Product</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2" }}>Aantal</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2" }}>
                Prijs (excl. BTW)
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2" }}>Totaal</th>
            </tr>
          </thead>
          <tbody>
            {orderData.items.map((item: any, index: number) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <strong>{item.arcleunik || item.id}</strong>
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.name}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.quantity}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  €{(item.priceExclVAT || item.price).toFixed(2)}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  €{(item.quantity * (item.priceExclVAT || item.price)).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ backgroundColor: "#f9f9f9", padding: "15px", margin: "20px 0" }}>
          <h3>💰 Financiële samenvatting:</h3>
          <p>Subtotaal (excl. BTW): €{orderData.subtotalExclVAT.toFixed(2)}</p>
          <p>BTW: €{orderData.totalVatAmount.toFixed(2)}</p>
          <p>Verzendkosten: €{orderData.shippingCost.toFixed(2)}</p>
          <p>
            <strong>Totaal (incl. BTW): €{orderData.totalInclVAT.toFixed(2)}</strong>
          </p>
        </div>

        <div style={{ backgroundColor: "#ffebee", borderLeft: "4px solid #e74c3c", padding: "15px", margin: "20px 0" }}>
          <h3>📋 Volgende stappen:</h3>
          <ol>
            <li>Controleer de pakbon (bijgevoegd als PDF)</li>
            <li>Bereid de bestelling voor</li>
            <li>Plan de levering/afhaling</li>
            <li>Informeer de klant bij eventuele wijzigingen</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
