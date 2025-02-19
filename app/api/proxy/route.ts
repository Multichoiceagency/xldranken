import { type NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
const API_URL_LIST = process.env.API_URL_LIST as string;
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
      return NextResponse.json({ error: "API Key is missing." }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    // Gebruik de extra endpoint als 'nocategory' op "true" staat
    const useListEndpoint = searchParams.get("nocategory") === "true";
    const endpoint = useListEndpoint ? API_URL_LIST : API_URL;
    const apiUrl = `${endpoint}?apikey=${API_KEY}`;

    const response = await fetchWithTimeout(apiUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `API Error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    if (!data?.result?.product || !Array.isArray(data.result.product)) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = data.result.product.find(
      (p: any) => String(p.id_product_mysql) === String(productId)
    );
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Product gevonden: retourneer alleen het bericht en de productdata
    return NextResponse.json({ message: "Product found and loaded", product });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
