import ProductCard from "@/components/product-card";

export default async function ProductsPage() {
    const API_URL = "https://api.megawin.be/product/list/?apikey=YIwYR3LZbNXllabpGviSnXBHvtqfPAIN&fam2ID=6";
  
    try {
      // ✅ Data ophalen van de API
      const res = await fetch(API_URL, { method: "GET", cache: "no-store" }); 
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      
      const products = await res.json(); // ✅ API Response omzetten naar JSON
      console.log("DEBUG - Loaded products:", products); // 🔥 Debugging
  
      return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Producten</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: any) => (
              <ProductCard key={product.id_product_mysql} product={product} />
            ))}
          </div>
        </div>
      );
    } catch (error) {
      console.error("API Fetch Error:", error);
      return <div>Fout bij het laden van de producten.</div>;
    }
  }
  