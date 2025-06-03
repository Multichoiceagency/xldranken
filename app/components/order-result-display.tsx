import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, Package, BarChart3 } from "lucide-react"

interface OrderResult {
  success: boolean
  orderNumber: string
  total: string
  emailSent: boolean
  message: string
  categorization: {
    categories: Record<string, number>
    matchTypes: Record<string, number>
    lowConfidenceCount: number
    totalItems: number
  }
}

interface OrderResultDisplayProps {
  result: OrderResult
}

export function OrderResultDisplay({ result }: OrderResultDisplayProps) {
  const { categorization } = result
  const confidenceRate =
    ((categorization.totalItems - categorization.lowConfidenceCount) / categorization.totalItems) * 100

  return (
    <div className="space-y-6">
      {/* Order Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {result.success ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            Order Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="font-mono font-medium">{result.orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="font-medium">€{result.total}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Customer Email</p>
              <Badge variant={result.emailSent ? "default" : "destructive"}>
                {result.emailSent ? "Sent" : "Failed"}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Admin Email</p>
              <Badge variant="secondary">Sending in background</Badge>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{result.message}</p>
        </CardContent>
      </Card>

      {/* Categorization Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Categorization Analysis
          </CardTitle>
          <CardDescription>Product categorization accuracy and distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{categorization.totalItems}</div>
              <div className="text-sm text-muted-foreground">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {categorization.totalItems - categorization.lowConfidenceCount}
              </div>
              <div className="text-sm text-muted-foreground">High Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{categorization.lowConfidenceCount}</div>
              <div className="text-sm text-muted-foreground">Low Confidence</div>
            </div>
          </div>

          {/* Confidence Rate */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Categorization Confidence</span>
              <span className="text-sm text-muted-foreground">{confidenceRate.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  confidenceRate >= 90 ? "bg-green-500" : confidenceRate >= 70 ? "bg-yellow-500" : "bg-red-500"
                }`}
                style={{ width: `${confidenceRate}%` }}
              />
            </div>
          </div>

          {/* Categories Distribution */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Categories Found
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(categorization.categories)
                .sort(([, a], [, b]) => b - a)
                .map(([category, count]) => (
                  <div key={category} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">{category}</span>
                    <Badge variant="outline">{count} items</Badge>
                  </div>
                ))}
            </div>
          </div>

          {/* Match Types */}
          <div className="space-y-4 mt-6">
            <h4 className="font-medium">Match Types Used</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(categorization.matchTypes)
                .sort(([, a], [, b]) => b - a)
                .map(([matchType, count]) => (
                  <div key={matchType} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium capitalize">{matchType.replace("_", " ")}</span>
                    <Badge
                      variant={
                        matchType === "id_match"
                          ? "default"
                          : matchType === "exact"
                            ? "secondary"
                            : matchType === "partial"
                              ? "outline"
                              : "destructive"
                      }
                    >
                      {count}
                    </Badge>
                  </div>
                ))}
            </div>
          </div>

          {/* Warning for low confidence */}
          {categorization.lowConfidenceCount > 0 && (
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Categorization Warning</span>
              </div>
              <p className="text-sm text-orange-700 mt-1">
                {categorization.lowConfidenceCount} items have low confidence categorization. Consider adding these
                products to the arcleunikToFam2idMap for better accuracy.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
