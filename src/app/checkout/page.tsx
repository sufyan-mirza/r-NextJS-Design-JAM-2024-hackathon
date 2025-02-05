"use client";

import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { urlFor } from "../../sanity/lib/image";

import client from "../../sanity/lib/client";
import { useCart } from "../Context/CartContext";
import { useUser } from "../../hooks/useUser";

export default function CheckoutPage() {
  const { cart, getTotalPrice } = useCart();
  const { user } = useUser();
  const [loading, setLoading] = useState(false); // Prevents multiple submissions
  const [discount, setDiscount] = useState<number>(20);

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    const appliedDiscount = localStorage.getItem("appliedDiscount");
    if (appliedDiscount) {
      setDiscount(Number(appliedDiscount));
    }
  }, []);

  const subtotal = getTotalPrice();
  const total = Math.max(subtotal - discount, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value });
  };

  const handleValidation = () => {
    let valid = true;
    const errors: Record<string, string> = {};

    // Ensure all fields are filled
    Object.keys(formValues).forEach((key) => {
      if (!formValues[key as keyof typeof formValues]) {
        errors[key] = `${key.replace(/([A-Z])/g, " $1")} is required.`;
        valid = false;
      }
    });

    // Validate first name, last name, and city (only alphabetic)
    if (!/^[A-Za-z]+$/.test(formValues.firstName)) {
      errors.firstName = "First name should only contain letters.";
      valid = false;
    }
    if (!/^[A-Za-z]+$/.test(formValues.lastName)) {
      errors.lastName = "Last name should only contain letters.";
      valid = false;
    }
    if (!/^[A-Za-z\s]+$/.test(formValues.city)) {
      errors.city = "City should only contain letters.";
      valid = false;
    }

    // Validate zip code (5-digit number)
    if (!/^\d{5}$/.test(formValues.zipCode)) {
      errors.zipCode = "Postal code should be a 5-digit number.";
      valid = false;
    }

    // Validate phone number (11-digit number)
    if (!/^\d{11}$/.test(formValues.phone)) {
      errors.phone = "Phone number should be an 11-digit number.";
      valid = false;
    }

    // Validate email format
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formValues.email)) {
      errors.email = "Please enter a valid email address.";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handlePlaceOrder = async () => {
    console.log("🚀 handlePlaceOrder called");

    if (!handleValidation()) {
      toast.error("Validation failed. Please correct the errors.");
      return;
    }

    if (loading) return; // Prevent multiple submissions
    setLoading(true);
    setTimeout(() =>{
      toast.info("Processing order...");
    },100)
    

    const userIn = user && "id" in user ? (user as { id: string }).id : undefined;

    const orderData = {
      _type: "order",
      userId: userIn,
      first_name: formValues.firstName,
      last_name: formValues.lastName,
      address: formValues.address,
      city: formValues.city,
      zipCode: formValues.zipCode,
      phone: formValues.phone,
      email: formValues.email,
      cartItems: cart.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
      })),
      total: total,
      Delivery_Status: "pending",
    };

    try {
      console.log("📦 Sending order data:", orderData);
      await client.create(orderData);
      localStorage.removeItem(`cart_${userIn}`);
      localStorage.removeItem("appliedDiscount");

      setTimeout(() => {
        toast.success(" Order placed successfully!");
        setFormValues({
          firstName: "",
          lastName: "",
          address: "",
          city: "",
          zipCode: "",
          phone: "",
          email: "",
        });
      }, 500);

    } catch (error) {
      console.error("❌ Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-200 border rounded-lg p-6">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.productName} className="flex items-center gap-4 py-3 border-b">
                  <div className="w-16 h-16 rounded overflow-hidden">
                    {item.image && <img src={urlFor(item.image).url()} alt={item.productName} className="object-cover w-full h-full" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{item.productName}</h3>
                    <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">${item.price * item.quantity}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Your cart is empty.</p>
            )}
            <div className="text-right pt-4">
              <p className="text-sm">Subtotal = <span className="font-medium">${subtotal}</span></p>
              <p className="text-sm">Discount = <span className="font-medium">-${discount}</span></p>
              <p className="text-lg font-semibold">Total: ${total.toFixed(2)}</p>
            </div>
          </div>
          <div className="bg-slate-200 border rounded-lg p-6">
            <h2 className="text-xl font-semibold">Billing Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Object.keys(formValues).map((key) => (
                <div key={key}>
                  <label htmlFor={key} className="block text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}</label>
                  <input
                    id={key}
                    value={formValues[key as keyof typeof formValues]}
                    onChange={handleInputChange}
                    className="border w-full p-2 rounded mt-1"
                  />
                  {errors[key] && <p className="text-red-500 text-sm mt-1">{errors[key]}</p>}
                </div>
              ))}
            </div>
            <button 
              className="w-full h-12 bg-blue-500 hover:bg-green-400 text-black mt-4 rounded" 
              onClick={handlePlaceOrder} 
              disabled={loading}
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
