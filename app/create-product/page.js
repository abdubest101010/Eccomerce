"use client";

import { useEffect, useRef, useState } from "react";

export default function CreateProductPage() {
  const nameRef = useRef();
  const descriptionRef = useRef();
  const priceRef = useRef();
  const categoryRef = useRef();
  const stockRef = useRef();
  const imageRef = useRef();
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]); // State to hold categories

  // Fetch categories on component mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories"); // Adjust the endpoint as per your API
        const data = await response.json();
        setCategories(data); // Store categories in state
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  const handleImageChange = () => {
    const file = imageRef.current.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = nameRef.current.value;
    const description = descriptionRef.current.value;
    const price = priceRef.current.value;
    const category = categoryRef.current.value;
    const stock = stockRef.current.value;
    const image = imageRef.current.files[0];

    if (!name || !description || !price || !category || !stock || !image) {
      alert("Please fill in all fields.");
      return;
    }

    // Read the image as a Base64 string
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Image = reader.result.split(',')[1];
        const body = {
          name,
          description,
          price: parseFloat(price),
          category,
          stock: parseInt(stock, 10),
          imageUrl: `data:image/jpeg;base64,${base64Image}`,
        };

        const response = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error("Failed to create product");
        }

        const result = await response.json();
        alert("Product created successfully!");
        console.log(result);

        // Reset form
        nameRef.current.value = "";
        descriptionRef.current.value = "";
        priceRef.current.value = "";
        categoryRef.current.value = "";
        stockRef.current.value = "";
        imageRef.current.value = "";
        setPreview(null);
      } catch (error) {
        console.error("Error creating product:", error);
        alert("Something went wrong. Please try again.");
      }
    };

    reader.readAsDataURL(image);
  };

  return (
    <div className="max-w-lg mx-auto my-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Create Product
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Name:
          </label>
          <input
            type="text"
            ref={nameRef}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description:
          </label>
          <textarea
            ref={descriptionRef}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price:
          </label>
          <input
            type="number"
            step="0.01"
            ref={priceRef}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category:
          </label>
          <select
  ref={categoryRef}
  required
  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
>
  {categories.map((category) => (
    <option key={category.id} value={category.name}>
      {category.name}
    </option>
  ))}
</select>

        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Stock:
          </label>
          <input
            type="number"
            ref={stockRef}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image:
          </label>
          <input
            type="file"
            accept="image/*"
            ref={imageRef}
            onChange={handleImageChange}
            required
            className="mt-1 block w-full text-gray-700"
          />
        </div>
        {preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="Preview"
              className="w-full rounded-md border border-gray-300"
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Create Product
        </button>
      </form>
    </div>
  );
}
