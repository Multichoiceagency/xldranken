import { getProductsByFam2ID } from "@/lib/api";
import ProductCard from "@/components/product-card";
import type { ProductProps } from "@/types/product";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge, faTh } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Hero from "@/components/Hero";

export default async function AlcoholPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const categoryId = "10";
  const currentPage = Number(searchParams.page) || 1;
  const productsPerPage = Number(searchParams.limit) || 24;
  const gridView = searchParams.view === "grid2" ? "grid2" : "grid4"; // Default: 4-column grid

  // Fetch products on the server
  const allProducts: ProductProps[] = await getProductsByFam2ID(categoryId);

  // Pagination logic
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = allProducts.slice(startIndex, startIndex + productsPerPage);
  const totalPages = Math.ceil(allProducts.length / productsPerPage);

  // ✅ Correct `URLSearchParams` handling
  const createURL = (key: string, value: string | number) => {
    const params = new URLSearchParams();

    // ✅ Convert `searchParams` safely into URLSearchParams
    Object.entries(searchParams || {}).forEach(([paramKey, paramValue]) => {
      if (paramValue !== undefined && paramValue !== null) {
        params.set(paramKey, paramValue.toString());
      }
    });

    params.set(key, value.toString()); // ✅ Update the specific parameter
    return `/alcohol?${params.toString()}`;
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero title="Alcohol Assortiment" description="Bekijk meer dan 100 diverse alcohol soorten" />

      {/* Product Section */}
      <div className="container mx-auto px-8 py-8">
        {/* Show per page & Grid View Controls */}
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <div className="flex items-center space-x-2 text-sm">
            <span className="font-medium">Aantal producten per pagina:</span>
            {[9, 12, 18, 24].map((num) => (
              <Link
                key={num}
                href={createURL("limit", num)}
                className={`px-2 ${productsPerPage === num ? "font-bold text-black" : "text-gray-500"}`}
              >
                {num}
              </Link>
            ))}
          </div>

          {/* Grid View Toggle */}
          <div className="flex space-x-2">
            <Link
              href={createURL("view", "grid2")}
              className={`p-2 rounded ${gridView === "grid2" ? "bg-gray-300" : "bg-gray-100"}`}
            >
              <FontAwesomeIcon icon={faThLarge} />
            </Link>
            <Link
              href={createURL("view", "grid4")}
              className={`p-2 rounded ${gridView === "grid4" ? "bg-gray-300" : "bg-gray-100"}`}
            >
              <FontAwesomeIcon icon={faTh} />
            </Link>
          </div>
        </div>

        {/* Product Grid */}
        <div className={`grid gap-6 ${gridView === "grid2" ? "grid-cols-6" : "grid-cols-4"}`}>
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id_product_mysql} product={product} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-8">
          {currentPage > 1 && (
            <Link href={createURL("page", currentPage - 1)} className="px-4 py-2 bg-[#E2B505] text-white font-semibold hover:text-black rounded">
              Vorige
            </Link>
          )}
          <span className="font-medium">
            Pagina {currentPage} van {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link href={createURL("page", currentPage + 1)} className="px-4 py-2 bg-[#E2B505] text-white font-semibold hover:text-black rounded">
              Volgende
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
