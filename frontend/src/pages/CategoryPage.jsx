import React from 'react'
import { useProductStore } from '../stores/useProductStore'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from "framer-motion";
import ProductCard from '../components/ProductCard';


const CategoryPage = () => {
    const { fetchProductsByCategory, products } = useProductStore();
    const { category } = useParams();

    const categoryDescriptions = {
        'seedlings': '🌱 Start your farm strong with healthy young plants ready to thrive in your soil.🌱',
        'fertilizers': '💧 Boost your crops with high-quality nutrients for better yield and healthier soil. 💧',
        'grains': '🌾 High-grade grain varieties for planting or bulk-buying your seasonal needs. 🌾',
        'vegetable-crops': '🥕 Fresh and locally-sourced vegetables perfect for planting or direct market sales. 🥕',
        'tree-saplings': '🌳 Grow orchards or shade your land with hardy, ready-to-plant tree saplings. 🌳',
        'animal-feeds': '🐄 Nutritious feed mixes tailored for livestock health and daily farm efficiency. 🐄',
        'farming-tools': '🧰 Reliable hand tools designed for every stage of farming—from planting to harvest. 🧰',
        'storage-transports': '🚜 Smart solutions for storing, packaging, and moving your harvest with ease. 🚜',
    };

    useEffect(() => {
        fetchProductsByCategory(category);
    }, [fetchProductsByCategory, category]);

    const categoryDescription = categoryDescriptions[category] || 'No description available for this category.';
    const formattedCategoryName = category.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    console.log("Products", products);
    return (
        <div className='min-h-screen'>
            <div className='relative z-10 max-w-screen-xl mx-auto p-5 sm:px-6 lg:px-8'>
                <motion.h1
                    className='text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-4'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}>
                    {formattedCategoryName}
                </motion.h1>

                <motion.p
                    className='text-center text-lg font-bold text-emerald-300 mb-8'
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}>
                    {categoryDescription}
                </motion.p>

                <motion.div
                    className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {products?.length === 0 && (
                        <h2 className='text-3xl font-semibold text-gray-500 text-center col-span-full'>
                            No product available in this category yet
                        </h2>
                    )}

                    {products?.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}

                </motion.div>

            </div>
        </div>
    )
}

export default CategoryPage