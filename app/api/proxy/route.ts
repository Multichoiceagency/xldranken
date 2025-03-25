import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
const API_URL_LIST = process.env.API_URL_LIST as string;
const API_KEY = process.env.API_KEY || (process.env.NEXT_PUBLIC_API_KEY as string);

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
    console.log("Proxy API route called");

    if (!API_KEY) {
      console.error("API Key is missing");
      return Response.json({ error: "API Key is missing." }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");
    if (!productId) {
      return Response.json({ error: "Product ID is required." }, { status: 400 });
    }

    console.log("Fetching product with ID:", productId);

    // Use extra endpoint if 'nocategory' is "true"
    const useListEndpoint = searchParams.get("nocategory") === "true";
    const endpoint = useListEndpoint ? API_URL_LIST : API_URL;

    if (!endpoint) {
      console.error(`${useListEndpoint ? "API_URL_LIST" : "API_URL"} is missing`);
      return Response.json(
        { error: `${useListEndpoint ? "API_URL_LIST" : "API_URL"} is missing.` },
        { status: 500 }
      );
    }

    const apiUrl = `${endpoint}?apikey=${API_KEY}`;
    console.log(`Fetching from: ${endpoint} (hiding API key)`);

    const response = await fetchWithTimeout(apiUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      return Response.json(
        { error: `API Error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("API response structure:", Object.keys(data));

    if (!data?.result?.product || !Array.isArray(data.result.product)) {
      console.error("Unexpected API response structure");
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    // Find product by id_product_mysql (primary search)
    let product = data.result.product.find((p: any) => String(p.id_product_mysql) === String(productId));

    // If not found by id_product_mysql, try by productCode as fallback
    if (!product) {
      product = data.result.product.find((p: any) => String(p.productCode) === String(productId));
    }

    if (!product) {
      console.log(`Product with ID ${productId} not found`);

      // Return a list of available products for debugging
      const availableProducts = data.result.product.slice(0, 10).map((p: any) => ({
        id: p.id_product_mysql,
        title: p.title,
        productCode: p.productCode,
        arcleunik: p.arcleunik,
      }));

      return Response.json(
        {
          error: "Product not found",
          availableProducts,
          message: "Here are some available products for debugging",
        },
        { status: 404 }
      );
    }

    console.log(`Product with ID ${productId} found`);
    // Return the product data
    return Response.json({ message: "Product found and loaded", product });
  } catch (error) {
    console.error("Proxy API error:", error);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}