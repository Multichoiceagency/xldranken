import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
const API_KEY = process.env.API_KEY as string;
const CACHE_DURATION = 60000; // 1 minute cache (optional)

// ✅ In-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();

export async function GET(req: NextRequest) {
  try {
    if (!API_URL || !API_KEY) {
      return NextResponse.json({ error: "API URL or API Key is missing in environment variables." }, { status: 500 });
    }

    // Extract search parameters
    const { searchParams } = new URL(req.url);
    const fam2ID = searchParams.get("fam2ID");

    if (!fam2ID) {
      return NextResponse.json({ error: "Missing required parameter: fam2ID" }, { status: 400 });
    }

    // ✅ Check cache before making an API request
    const cacheKey = `fam2ID-${fam2ID}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      console.log("Serving cached data for:", cacheKey);
      return NextResponse.json(cachedData.data);
    }

    // Construct the API URL
    const fullUrl = `${API_URL}?apikey=${API_KEY}&fam2ID=${fam2ID}`;
    console.log("Fetching from:", fullUrl);

    // Fetch data from external API
    const response = await fetch(fullUrl, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("API Error:", response.statusText);
      return NextResponse.json(
        { error: `Error fetching data: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("API Data received:", data);

    // ✅ Ensure the expected data structure exists
    if (!data?.result?.product || !Array.isArray(data.result.product) || data.result.product.length === 0) {
      console.warn("No products found for fam2ID:", fam2ID);
      return NextResponse.json({ error: "No products found", products: [] }, { status: 200 });
    }

    // ✅ Store in cache
    cache.set(cacheKey, { data, timestamp: Date.now() });

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
