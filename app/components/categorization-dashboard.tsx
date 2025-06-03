"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useOrderAnalytics } from "@/hooks/use-order-analytics"
import { TrendingUp, Package, Target, RefreshCw } from "lucide-react"

export function CategorizationDashboard() {
  const { analytics, isLoading, refreshAnalytics } = useOrderAnalytics()

  if (isLoading) {
    return <div>Loading analytics...</div>
  }

  if (!analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Categorization Analytics</CardTitle>
          <CardDescription>No order data available yet</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Categorization Dashboard</h2>
        <Button onClick={refreshAnalytics} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Orders processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Confidence</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageConfidence.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Categorization accuracy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Match Types</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(analytics.matchTypeDistribution).length}</div>
            <p className="text-xs text-muted-foreground">Different match types used</p>
          </CardContent>
        </Card>
      </div>

      {/* Most Common Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Most Common Categories</CardTitle>
          <CardDescription>Top product categories across all orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analytics.mostCommonCategories.map(({ category, count }, index) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">#{index + 1}</span>
                  <span>{category}</span>
                </div>
                <Badge variant="outline">{count} items</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Match Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Match Type Distribution</CardTitle>
          <CardDescription>How products are being categorized</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(analytics.matchTypeDistribution)
              .sort(([, a], [, b]) => b - a)
              .map(([matchType, count]) => (
                <div key={matchType} className="flex items-center justify-between">
                  <span className="capitalize">{matchType.replace("_", " ")}</span>
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
        </CardContent>
      </Card>
    </div>
  )
}
