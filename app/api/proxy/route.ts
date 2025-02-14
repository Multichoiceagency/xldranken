import { type NextRequest, NextResponse } from "next/server";

const API_URL = "https://api.megawin.be/product/list/";
const API_KEY = process.env.API_KEY as string;

async function fetchWithTimeout(url: string, options = {}, timeout = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw new Error("❌ API request timed out or was aborted.");
  }
}

export async function GET(req: NextRequest) {
  try {
    if (!API_KEY) {
      console.error("❌ API Key is missing.");
      return NextResponse.json({ error: "API Key is missing." }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");

    if (!productId) {
      console.error("❌ No product ID provided.");
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    console.log(`🔎 Requesting product with ID: ${productId}`);

    const apiUrl = `${API_URL}?apikey=${API_KEY}`;
    console.log("🔗 Fetching from API:", apiUrl);

    const response = await fetchWithTimeout(apiUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error(`❌ API Error: ${response.status} ${response.statusText}`);
      return NextResponse.json({ error: `API Error: ${response.status} ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    console.log("📦 Full API Response:", JSON.stringify(data, null, 2)); // LOG FULL API RESPONSE

    if (!data?.result?.product || !Array.isArray(data.result.product)) {
      console.error("❌ No products received from API.");
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Find the product (ensure both are strings for comparison)
    const product = data.result.product.find((p: any) => String(p.id_product_mysql) === String(productId));

    if (!product) {
      console.error(`❌ Product with ID ${productId} not found.`);
      return NextResponse.json({ error: "Product ID not found" }, { status: 404 });
    }

    console.log("✅ Product found:", product.title);
    return NextResponse.json({ product });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
