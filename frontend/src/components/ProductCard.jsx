import React from 'react'
import toast from 'react-hot-toast';
import { ShoppingCart } from 'lucide-react';
import { useUserStore } from '../stores/useUserStore';
import { useCartStore } from '../stores/useCartStore';


const ProductCard = ({ product }) => {
    const { user } = useUserStore();
    const { addToCart } = useCartStore();
    const handleAddToCart = () => {

        if (!user) {
            toast.error("Please Login to Add Product to Cart", { id: 'login' });
            return;
        } else {
            addToCart(product);
        }

    };
    return (
        <div className="flex w-full h-full flex-col overflow-hidden rounded-lg border border-emerald-700 shadow-lg">
            <div>
                <img className="object-cover w-full" src={product.image} alt="Product Image" />
            </div>

            {/* Main content layout */}
            <div className="flex flex-col flex-grow mt-4 px-5 pb-5">
                {/* Title with fixed space */}
                <h5 className="text-lg font-semibold tracking-tight text-emerald-400 ">
                    {product.name}
                </h5>

                <p className="text-base font-medium tracking-tight text-emerald-400">
                    {product.description}
                </p>

                {/* Price with fixed margin top and no mb */}
                <div className="mt-2 mb-4">
                    <span className="text-2xl font-bold text-emerald-400">${product.price}</span>
                </div>

                {/* Push button to bottom */}
                <div className="mt-auto">
                    <button
                        className="flex items-center justify-center w-full rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart size={22} className="mr-2" />
                        Add to cart
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard