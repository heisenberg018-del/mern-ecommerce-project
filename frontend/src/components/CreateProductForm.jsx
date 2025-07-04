import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Upload, Loader } from 'lucide-react';
import { useProductStore } from '../stores/useProductStore';
import toast from 'react-hot-toast';

const categories = ['seedlings', 'fertilizers', 'grains', 'vegetable-crops', 'tree-saplings', 'animal-feeds', 'farming-tools', 'storage-transports'];

const CreateProductForm = () => {
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
    });

    const { createProduct, loading } = useProductStore();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createProduct(newProduct);
            setNewProduct({ name: '', description: '', price: '', category: '', image: '' });
        } catch (error) {
            console.log("Something Went Wrong during Adding Product");

        }

    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setNewProduct({ ...newProduct, image: reader.result });
            }

            reader.readAsDataURL(file); //based64 encoded image
        }
    }
    return (
        <motion.div
            className='bg-emerald-700 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <h2 className='text-2xl font-semibold mb-6 text-emerald-100'>Create New Products</h2>
            <form className='space-y-4' onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name" className='block text-sm font-medium text-emerald-100'>Product Name</label>
                    <input
                        type="text"
                        name='name'
                        id='name'
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className='mt-1 block w-full bg-emerald-50 border border-emerald-600 rounded-md shadow-sm py-2 px-3 text-emerald-500 focus:outline-none focus:ring-2	focus:ring-emerald-500 focus:border-emerald-500'
                        required />
                </div>
                <div>
                    <label htmlFor="description" className='block text-sm font-medium text-emerald-100'>Product Description</label>
                    <textarea
                        id="description"
                        name='description'
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        rows={3}
                        className='mt-1 block w-full bg-emerald-50 border border-emerald-600 rounded-md shadow-sm py-2 px-3 text-emerald-500 focus:outline-none focus:ring-2	focus:ring-emerald-500 focus:border-emerald-500'
                        required />
                </div>
                <div>
                    <label htmlFor="price" className='block text-sm font-medium text-emerald-100'>Product Price</label>
                    <input
                        type="number"
                        name='price'
                        id='price'
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        step={"0.01"}
                        className='mt-1 block w-full bg-emerald-50 border border-emerald-600 rounded-md shadow-sm py-2 px-3 text-emerald-500 focus:outline-none focus:ring-2	focus:ring-emerald-500 focus:border-emerald-500'
                        required />
                </div>
                <div>
                    <label htmlFor="price" className='block text-sm font-medium text-emerald-100'>Categories</label>

                    <select
                        name="category"
                        id="category"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className='mt-1 block w-full bg-emerald-50 border border-emerald-600 rounded-md shadow-sm py-2 px-3 text-emerald-500 focus:outline-none focus:ring-2	focus:ring-emerald-500 focus:border-emerald-500'
                        required
                    >
                        <option value="">Select a Category</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='mt-1 flex items-center'>
                    <input type='file' id='image' className='sr-only' accept='image/*' onChange={handleImageChange} />
                    <label
                        htmlFor='image'
                        className='cursor-pointer bg-emerald-50 py-2 px-3 border border-emerald-600 rounded-md shadow-sm text-sm leading-4 font-medium text-emerald-500 hover:bg-emerald-100  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
                    >
                        <Upload className='h-5 w-5 inline-block mr-2' />
                        Upload Image
                    </label>
                    {newProduct.image && <span className='ml-3 text-sm text-emerald-50'>Image Uploaded Successfully</span>}
                </div>

                <button type='submit' className='cursor-pointer w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-emerald-500 bg-emerald-100 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                            Loading...
                        </>
                    ) : (
                        <>
                            <PlusCircle className='mr-2 h-5 w-5' />
                            Create Product
                        </>
                    )}
                </button>

            </form>
        </motion.div>
    )
}

export default CreateProductForm