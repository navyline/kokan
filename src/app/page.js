'use client';

import { useEffect, useState } from 'react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Fetch products failed:', error);
        setError(error.message);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      {error && <p className="text-red-500">Failed to load products: {error}</p>}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <li key={product._id} className="border p-4 rounded">
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p>{product.description}</p>
            <img src={product.image} alt={product.name} className="w-full h-64 object-cover mt-2" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
