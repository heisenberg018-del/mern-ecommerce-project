import React from 'react'
import { useEffect, useState } from 'react';
import axios from '../lib/axios';
import toast from 'react-hot-toast';

//component
import ProductCard from './ProductCard'
import LoadingSpinner from "./LoadingSpinner";

const PeopleAlsoBought = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const res = await axios.get('/products/recommendations');
                setRecommendations(res.data);
            } catch (error) {
                toast.error(error.response.data.message || "Failed to fetch recommendations");
            } finally {
                setIsLoading(false);
            }
        };
        fetchRecommendations();
    }, []);

    if (isLoading) return <LoadingSpinner />
    return (
        <div className='mt-8'>
            <h3 className='text-2xl font-semibold text-emerald-400'>People Also Bought - Recommended for You!</h3>
            <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
                {recommendations.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    )
}

export default PeopleAlsoBought