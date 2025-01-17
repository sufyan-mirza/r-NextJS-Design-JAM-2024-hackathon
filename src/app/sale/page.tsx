'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaAngleRight, FaCaretDown, FaCaretUp } from "react-icons/fa";
import Image from "next/image";
import Client from "../../sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

interface Product {
  _id: string;
  productName: string;
  category: string;
  price: number;
  image: string;
}

export default function Sale() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = `*[_type == "product"] {
          _id,
          productName,
          category,
          price,
          "image": image.asset->url
        }`;
        const data = await Client.fetch(query);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8">
      <div className="flex flex-col lg:flex-row gap-10 mb-20">
        {/* Sidebar Section */}
        <div className="lg:w-[250px] w-full">
          {/* Mobile toggle button */}
          <div className="flex justify-between items-center lg:hidden mt-6 mb-2">
            <h3 className="text-lg font-semibold">Categories</h3>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-xl"
            >
              {isSidebarOpen ? <FaCaretUp /> : <FaCaretDown />}
            </button>
          </div>

          {/* Categories list */}
          <ul
            className={`flex flex-col gap-6 border-r border-gray-300 pt-10 pr-6 lg:block ${isSidebarOpen ? 'block' : 'hidden'} lg:flex`}
          >
            {[
              "Women's Fashion",
              "Men's Fashion",
              "Hoodies & Sweatshirts",
              "Tops & T-shirts",
              "Shorts",
              "Sports & Outdoor",
              "Trackcuits",
              "Jumpsuits & Rompers",
              "Socks",
              "Accessories & Equipment"
            ].map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center w-full cursor-pointer hover:text-gray-500"
              >
                <Link href="#" className="text-sm sm:text-base">
                  {item}
                </Link>
                {index < 2 && (
                  <FaAngleRight className="text-sm hidden lg:block mr-4" />
                )}
              </li>
            ))}
          </ul>
        </div>


        {/* Product Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {products.length > 0 ? (
            products.map((item) => (
              <div key={item._id} className="font-bold text-slate-600">
                <Link href={`/product/${item._id}`} className="block">
                  <img
                    src={item.image} // Use urlFor to generate correct image URL
                    alt={item.productName}
                    width={400}
                    height={300}
                  />
                  <p className="mt-2">{item.productName}</p>
                  <p>{item.category}</p>
                  <p>₹ {item.price}</p>
                </Link>
              </div>
            ))
          ) : (
            <p>Loading products...</p>
          )}
        </div>
      </div>
    </div>
  );
}
