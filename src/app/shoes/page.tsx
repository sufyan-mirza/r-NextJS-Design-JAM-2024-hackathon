'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";

import client from "../../sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

interface Product {
  _id: string;
  productName: string;
  category: string;
  price: number;
  image: string;
  status: string;  // Added the 'status' field
}

export default function Sale() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<string>("default");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = `*[_type == "product" && category match "Shoes"] {
          _id,
          productName,
          category,
          price,
          "image": image.asset->url,
          status
        }`;
        const data: Product[] = await client.fetch(query);

        setProducts(data);
        setFilteredProducts(data); // Set initial filtered products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, []);

  // Sort products if the "High to Low" option is selected
  useEffect(() => {
    let filtered = products;

    if (sortBy === "highToLow") {
      filtered = filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  }, [sortBy, products]);

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 mt-5 mb-20"> {/* Added margin bottom */}
      <div className="flex justify-end mb-6">
        {/* Sorting Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="default">Default</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <div key={item._id} className="bg-white border border-black rounded-lg overflow-hidden shadow-md p-4 transition-transform duration-300 transform hover:scale-105">
              <Link href={`/product/${item.productName}`} className="block">
                <img
                  src={urlFor(item.image).url()}
                  alt={item.productName}
                  width={400}
                  height={300}
                  className="rounded-md object-cover h-40 w-full"  // Responsive image with fixed height
                />
                <div className="mt-2">
                  {/* Item Status */}
                  <p className="text-sm mt-1 text-orange-800">{item.status}</p> {/* Status */}
                  <p className="mt-1 text-sm text-orange-800">{item.category}</p>
                  <p className="text-lg font-semibold sm:text-sm md:text-base lg:text-lg truncate">{item.productName}</p>
                  <p className="mt-2 text-lg font-bold">₹ {item.price}</p>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>No products found with the selected filters.</p>
        )}
      </div>
    </div>
  );
}
