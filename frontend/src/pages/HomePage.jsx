import React, { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";

import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";


const categories = [
  { href: '/seedlings', name: 'Seedlings', imageUrl: '/seedlings.png', description: '🌱 Start your farm strong with healthy young plants ready to thrive in your soil.🌱' },
  { href: '/fertilizers', name: 'Fertilizers', imageUrl: '/fertilizers.png', description: '💧 Boost your crops with high-quality nutrients for better yield and healthier soil. 💧' },
  { href: '/grains', name: 'Grains', imageUrl: '/grain.png', description: '🌾 High-grade grain varieties for planting or bulk-buying your seasonal needs. 🌾' },
  { href: '/vegetable-crops', name: 'Vegetable Crops', imageUrl: '/vegetable-crops.png', description: '🥕 Fresh and locally-sourced vegetables perfect for planting or direct market sales. 🥕' },
  { href: '/tree-saplings', name: 'Tree Saplings ', imageUrl: '/tree-saplings.png', description: '🌳 Grow orchards or shade your land with hardy, ready-to-plant tree saplings. 🌳' },
  { href: '/animal-feeds', name: 'Animal Feeds', imageUrl: '/animal-feeds.png', description: '🐄 Nutritious feed mixes tailored for livestock health and daily farm efficiency. 🐄' },
  { href: '/farming-tools', name: 'Farming Tools', imageUrl: '/farming-tools.png', description: '🧰 Reliable hand tools designed for every stage of farming—from planting to harvest. 🧰' },
  { href: '/storage-transports', name: 'Storage & Transport ', imageUrl: '/storage-transport.png', description: '🚜 Smart solutions for storing, packaging, and moving your harvest with ease. 🚜' },
];

const HomePage = () => {
  const { products, isLoading, fetchFeaturedProducts } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();

  }, [fetchFeaturedProducts])
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto py-5 sm:px-6 lg:px-8">
        <h1 className='text-center text-2xl sm:text-6xl font-bold text-emerald-400 mb-4'>
          Explore Our Categories
        </h1>
        <p className='text-center text-xl font-bold text-emerald-300 mb-12'>
          Discover the latest trends in agriculture and farming with our curated selection of products.
        </p>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-emerald-400'>
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>
        {!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
      </div>

    </div>
  );
};

export default HomePage;
