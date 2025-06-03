"use client"

import { useState, useEffect } from "react"

interface OrderAnalytics {
  totalOrders: number
  averageConfidence: number
  mostCommonCategories: Array<{ category: string; count: number }>
  problematicProducts: Array<{ name: string; confidence: number }>
  matchTypeDistribution: Record<string, number>
}

export function useOrderAnalytics() {
  const [analytics, setAnalytics] = useState<OrderAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const addOrderResult = (result: any) => {
    // Store order results in localStorage for analytics
    const existingData = localStorage.getItem("order-analytics")
    const orders = existingData ? JSON.parse(existingData) : []

    orders.push({
      timestamp: new Date().toISOString(),
      orderNumber: result.orderNumber,
      categorization: result.categorization,
    })

    // Keep only last 100 orders
    if (orders.length > 100) {
      orders.splice(0, orders.length - 100)
    }

    localStorage.setItem("order-analytics", JSON.stringify(orders))
    calculateAnalytics(orders)
  }

  const calculateAnalytics = (orders: any[]) => {
    if (orders.length === 0) {
      setAnalytics(null)
      return
    }

    const totalOrders = orders.length
    let totalConfidenceSum = 0
    const categoryCount: Record<string, number> = {}
    const matchTypeCount: Record<string, number> = {}

    orders.forEach((order) => {
      const cat = order.categorization
      const confidence = ((cat.totalItems - cat.lowConfidenceCount) / cat.totalItems) * 100
      totalConfidenceSum += confidence

      // Aggregate categories
      Object.entries(cat.categories).forEach(([category, count]) => {
        categoryCount[category] = (categoryCount[category] || 0) + (count as number)
      })

      // Aggregate match types
      Object.entries(cat.matchTypes).forEach(([matchType, count]) => {
        matchTypeCount[matchType] = (matchTypeCount[matchType] || 0) + (count as number)
      })
    })

    const averageConfidence = totalConfidenceSum / totalOrders
    const mostCommonCategories = Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }))

    setAnalytics({
      totalOrders,
      averageConfidence,
      mostCommonCategories,
      problematicProducts: [], // Could be enhanced to track specific products
      matchTypeDistribution: matchTypeCount,
    })
  }

  const loadAnalytics = () => {
    setIsLoading(true)
    const existingData = localStorage.getItem("order-analytics")
    const orders = existingData ? JSON.parse(existingData) : []
    calculateAnalytics(orders)
    setIsLoading(false)
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  return {
    analytics,
    isLoading,
    addOrderResult,
    refreshAnalytics: loadAnalytics,
  }
}
