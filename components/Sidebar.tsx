"use client";

interface SidebarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  showPromotions: boolean;
  setShowPromotions: (value: boolean) => void;
  minPrice: number | null;
  setMinPrice: (value: number | null) => void;
  maxPrice: number | null;
  setMaxPrice: (value: number | null) => void;
  availableBrands: string[];
  selectedBrand: string;
  setSelectedBrand: (value: string) => void;
  onReset: () => void;
}

export default function Sidebar({
  searchTerm,
  setSearchTerm,
  showPromotions,
  setShowPromotions,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  availableBrands,
  selectedBrand,
  setSelectedBrand,
  onReset,
}: SidebarProps) {
  return (
    <div className="p-4 border rounded space-y-4">
      <h2 className="text-xl font-semibold">Filters</h2>
      {/* Zoekveld */}
      <div>
        <label className="block mb-1">Zoek</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Zoek op naam..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* Promotie filter */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="promo"
          className="mr-2"
          checked={showPromotions}
          onChange={(e) => setShowPromotions(e.target.checked)}
        />
        <label htmlFor="promo">Alleen promoties</label>
      </div>
      {/* Prijs filter */}
      <div>
        <label className="block mb-1">Prijs (min - max)</label>
        <div className="flex space-x-2">
          <input
            type="number"
            className="w-1/2 p-2 border rounded"
            placeholder="Min"
            value={minPrice !== null ? minPrice : ""}
            onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : null)}
          />
          <input
            type="number"
            className="w-1/2 p-2 border rounded"
            placeholder="Max"
            value={maxPrice !== null ? maxPrice : ""}
            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
          />
        </div>
      </div>
      {/* Merk filter */}
      <div>
        <label className="block mb-1">Merk</label>
        <select
          className="w-full p-2 border rounded"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          <option value="">Alle merken</option>
          {availableBrands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>
      <button onClick={onReset} className="w-full py-2 bg-gray-300 rounded">
        Reset Filters
      </button>
    </div>
  );
}
