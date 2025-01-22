"use client";
import { useCart } from "../Context/CartContext"; // Import useCart hook
import Link from "next/link";
import { RiDeleteBin6Line } from "react-icons/ri";

const CartPage = () => {
  const { cart, removeFromCart, incrementQuantity, decrementQuantity } = useCart();

  const handleRemove = (productName: string) => {
    removeFromCart(productName);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, product) => total + product.price * product.quantity, 0);
  };

  return (
    <div className="container mx-auto px-6 sm:px-8 py-12 text-black">
      <h1 className="text-5xl font-extrabold text-center mb-12 tracking-tight">
        Your Cart
      </h1>

      {cart.length === 0 ? (
        <div className="text-center text-xl text-gray-500">Your cart is empty.</div>
      ) : (
        <>
          {/* Cart Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mb-8">
            {cart.map((item) => (
              <div
                key={item.productName}
                className="group relative bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 ease-in-out hover:scale-105"
              >
                {/* Product Image */}
                <div className="relative w-full h-64 overflow-hidden rounded-t-3xl bg-gray-100 flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="object-cover w-full h-full transform transition-all duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-300 flex items-center justify-center rounded-md">
                      No Image
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="px-4 py-6">
                  <p className="text-lg font-semibold truncate">{item.productName}</p>
                  <p className="text-sm text-gray-500">₹{item.price}</p>

                  {/* Quantity Controls */}
                  <div className="flex items-center mt-4 gap-4">
                    <button
                      onClick={() => decrementQuantity(item.productName)}
                      className="bg-transparent text-black p-0 w-5 h-5 border-2 border-black rounded-full hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
                    >
                      -
                    </button>
                    <p className="text-xl font-semibold text-gray-700">{item.quantity}</p>
                    <button
                      onClick={() => incrementQuantity(item.productName)}
                      className="bg-transparent text-black p-0 w-5 h-5 border-2 border-black rounded-full hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove Button */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleRemove(item.productName)}
                    className="text-red-600 hover:text-red-800 text-2xl font-semibold"
                  >
                    <RiDeleteBin6Line />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-100 p-6 rounded-lg shadow-lg mb-8">
            <p className="text-2xl font-semibold">Total: ₹{getTotalPrice()}</p>
            <Link href="/checkout">
              <button className="bg-black text-white py-3 px-8 rounded-lg shadow-xl w-full sm:w-auto transform transition-all duration-300 hover:bg-gray-800 hover:scale-105">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
