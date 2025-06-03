"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export function CategorizationDebug() {
  const [testData, setTestData] = useState({
    name: "COCA+COLA+12X50CL+PETFLES+%2B+STATIE",
    guid: "F4AD9879-51B1-4502-2E02-769F82F89EB0",
    volume: "12345",
    arcleunik: "",
    fam2id: "",
  })

  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [apiTest, setApiTest] = useState<any>(null)

  const testCategorization = async () => {
    setLoading(true)
    setResult(null)

    try {
      // Import the categorization function
      const { categorizeProduct } = await import("@/lib/product-categorizer")

      console.log("Testing categorization with:", testData)

      const categorizationResult = await categorizeProduct(
        testData.name,
        testData.volume || undefined,
        testData.arcleunik || undefined,
        testData.fam2id || undefined,
        testData.guid || undefined,
      )

      console.log("Categorization result:", categorizationResult)
      setResult(categorizationResult)
    } catch (error) {
      console.error("Categorization test error:", error)
      setResult({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setLoading(false)
    }
  }

  const testApiDirectly = async () => {
    if (!testData.guid) {
      alert("GUID is required for API test")
      return
    }

    setLoading(true)
    setApiTest(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const apiKey = process.env.NEXT_PUBLIC_API_KEY

      if (!apiUrl || !apiKey) {
        throw new Error("API configuration missing")
      }

      const url = `${apiUrl}?apikey=${apiKey}&guid=${testData.guid}`
      console.log("Testing API URL:", url)

      const response = await fetch(url)
      const data = await response.json()

      console.log("Direct API response:", data)
      setApiTest({
        status: response.status,
        ok: response.ok,
        data: data,
      })
    } catch (error) {
      console.error("API test error:", error)
      setApiTest({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Categorization Debug Tool</CardTitle>
          <CardDescription>Test de categorization functie met echte product data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={testData.name}
                onChange={(e) => setTestData({ ...testData, name: e.target.value })}
                placeholder="Product naam"
              />
            </div>
            <div>
              <Label htmlFor="guid">GUID</Label>
              <Input
                id="guid"
                value={testData.guid}
                onChange={(e) => setTestData({ ...testData, guid: e.target.value })}
                placeholder="Product GUID"
              />
            </div>
            <div>
              <Label htmlFor="volume">Volume/Arcleunik</Label>
              <Input
                id="volume"
                value={testData.volume}
                onChange={(e) => setTestData({ ...testData, volume: e.target.value })}
                placeholder="Volume field"
              />
            </div>
            <div>
              <Label htmlFor="arcleunik">Arcleunik</Label>
              <Input
                id="arcleunik"
                value={testData.arcleunik}
                onChange={(e) => setTestData({ ...testData, arcleunik: e.target.value })}
                placeholder="Arcleunik field"
              />
            </div>
            <div>
              <Label htmlFor="fam2id">Existing Fam2id</Label>
              <Input
                id="fam2id"
                value={testData.fam2id}
                onChange={(e) => setTestData({ ...testData, fam2id: e.target.value })}
                placeholder="Existing fam2id"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={testCategorization} disabled={loading}>
              {loading ? "Testing..." : "Test Categorization"}
            </Button>
            <Button onClick={testApiDirectly} disabled={loading} variant="outline">
              Test API Direct
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Test Results */}
      {apiTest && (
        <Card>
          <CardHeader>
            <CardTitle>Direct API Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            {apiTest.error ? (
              <div className="text-red-600">
                <strong>Error:</strong> {apiTest.error}
              </div>
            ) : (
              <div className="space-y-2">
                <div>
                  <Badge variant={apiTest.ok ? "default" : "destructive"}>Status: {apiTest.status}</Badge>
                </div>
                <div>
                  <Label>Response Data:</Label>
                  <Textarea value={JSON.stringify(apiTest.data, null, 2)} readOnly className="h-40 font-mono text-sm" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Categorization Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Categorization Results</CardTitle>
          </CardHeader>
          <CardContent>
            {result.error ? (
              <div className="text-red-600">
                <strong>Error:</strong> {result.error}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Fam2id:</Label>
                    <div className="font-mono">{result.fam2id}</div>
                  </div>
                  <div>
                    <Label>Category:</Label>
                    <div>{result.categoryName}</div>
                  </div>
                  <div>
                    <Label>Match Type:</Label>
                    <Badge>{result.matchType}</Badge>
                  </div>
                  <div>
                    <Label>Confidence:</Label>
                    <div>{(result.confidence * 100).toFixed(1)}%</div>
                  </div>
                </div>

                {result.matchedProduct && (
                  <div>
                    <Label>Matched Product:</Label>
                    <Textarea
                      value={JSON.stringify(result.matchedProduct, null, 2)}
                      readOnly
                      className="h-32 font-mono text-sm"
                    />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Environment Check */}
      <Card>
        <CardHeader>
          <CardTitle>Environment Check</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <Badge variant={process.env.NEXT_PUBLIC_API_URL ? "default" : "destructive"}>
                API URL: {process.env.NEXT_PUBLIC_API_URL ? "SET" : "NOT SET"}
              </Badge>
            </div>
            <div>
              <Badge variant={process.env.NEXT_PUBLIC_API_KEY ? "default" : "destructive"}>
                API KEY: {process.env.NEXT_PUBLIC_API_KEY ? "SET" : "NOT SET"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
