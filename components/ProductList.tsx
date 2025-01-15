'use client';

import React from "react";
import productsData from "@/data/product.json";

type Product = {
  id_product_mysql: string;
  arcleunik: string;
  title: string;
  productCode: string;
  photo1_base64: string;
  prix_vente_groupe: string;
  prix_en_promo: number;
};

function ProductList() {
  const product: Product = productsData as Product;

  return (
    <div className="container mx-auto px-4 py-6">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Arcleunik</th>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Product Code</th>
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Promo Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">{product.id_product_mysql || "N/A"}</td>
            <td className="border px-4 py-2">{product.arcleunik || "N/A"}</td>
            <td className="border px-4 py-2">{product.title || "N/A"}</td>
            <td className="border px-4 py-2">{product.productCode || "N/A"}</td>
            <td className="border px-4 py-2">
              {product.photo1_base64 ? (
                <img
                  src={`data:image/jpeg;base64,${product.photo1_base64}`}
                  alt={product.title || "Product Image"}
                  style={{ width: "100px", height: "auto" }}
                />
              ) : (
                "No Image"
              )}
            </td>
            <td className="border px-4 py-2">
              {product.prix_vente_groupe
                ? `€${parseFloat(product.prix_vente_groupe).toFixed(2)}`
                : "No Price"}
            </td>
            <td className="border px-4 py-2">
              {product.prix_en_promo > 0
                ? `€${product.prix_en_promo.toFixed(2)}`
                : "No Promo"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;
