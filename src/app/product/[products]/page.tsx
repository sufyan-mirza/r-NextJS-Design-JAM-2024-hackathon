"use client";
import { useState, useEffect } from "react";
import { useCart } from "../../Context/CartContext";
import client from "../../../sanity/lib/client";
import { useParams } from "next/navigation";

interface Product {
  _id: string;
  productName: string;
  description: string;
  category: string;
  price: number;
  inventory: number;
  colors: string[];
  status: string;
  image?: string;
}

const Page = () => {
  const { addToCart } = useCart();
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const productName =
    typeof params.products === "string" ? decodeURIComponent(params.products) : "";

  useEffect(() => {
    if (!productName) {
      setError("Invalid product name.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const query = `*[_type == "product" && productName == $name][0] {
          _id,
          productName,
          description,
          category,
          price,
          inventory,
          colors,
          status,
          "image": image.asset->url
        }`;
        const data = await client.fetch(query, { name: productName });
        if (!data) {
          setError("Product not found.");
        } else {
          setProduct(data);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productName]);

  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => setSuccessMessage(""), 2000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage]);

  const handleAddToCart = (product: Omit<Product, "quantity">) => {
    addToCart({ ...product, quantity: 1 });
    setSuccessMessage("Product added successfully!");
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error || !product) {
    return <div className="text-center py-10 text-red-500">{error || "Product not found."}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="flex justify-center">
          {product.image ? (
            <img
              src={product.image}
              width={400}
              height={400}
              alt={product.productName || "Default Product Image"}
              className="rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-400 h-400 bg-gray-200 rounded-lg flex items-center justify-center">
              No Image Available
            </div>
          )}
        </div>
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-bold">{product.productName}</h1>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-xl font-semibold">Price: ${product.price}</p>
          <p className="text-gray-500">
            <span className="font-bold">Category:</span> {product.category}
          </p>
          <p className="text-gray-500">
            <span className="font-bold">Inventory:</span> {product.inventory}
          </p>
          <p className="text-gray-500">
            <span className="font-bold">Status:</span> {product.status}
          </p>
          <div>
            <h3 className="font-semibold mb-2">Available Colors:</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {product.colors.map((color, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: color,
                    border: color === "white" ? "2px solid black" : "1px solid #ccc",
                    boxShadow: color === "white" ? "0 0 8px rgba(0, 0, 0, 0.5)" : "0 0 4px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {color === "white" && (
                    <span className="text-black font-medium text-xs">White</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => handleAddToCart(product)}
            aria-label={`Add ${product.productName} to cart`}
            className="bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-all"
          >
            Add to Cart
          </button>
          {successMessage && (
            <div className="text-center text-green-700 mt-4">{successMessage}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
