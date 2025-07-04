import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useProductStore = create((set) => ({
    products: [],
    loading: false,
    setProducts: (products) => set({ products }),

    createProduct: async (productData) => {
        set({ loading: true });
        try {
            const res = await axios.post("/products", productData);
            set((prevState) => ({
                products: [...prevState.products, res.data],
                loading: false,
            }));
            toast.success("Product Added Succesfully")
        } catch (error) {
            toast.error(error.response.data.error || "Failed to create product");
            set({ loading: false });
        }
    },

    fetchAllProducts: async () => {
        set({ loading: true });
        try {
            const response = await axios.get('/products');
            set({ products: response.data.products, loading: false });
        } catch (error) {
            set({ error: "Failed to Fetch Products", loading: false });
            toast.error(error.response.data.error || "Failed to fetch products");
        }
    },

    fetchProductsByCategory: async (category) => {
        set({ loading: true });
        try {
            const response = await axios.get(`/products/category/${category}`);
            set({ products: response.data.products, loading: false });
        } catch (error) {
            set({ error: "Failed to Fetch Products", loading: false });
            toast.error(error.response.data.error || "Failed to fetch products by category");
        }
    },

    deleteProduct: async (productId) => {
        set({ loading: true });
        try {
            await axios.delete(`/products/${productId}`);
            set((prevProducts) => ({
                products: prevProducts.products.filter((product) => product._id !== productId),
                loading: false,
            }));
            toast.success("Product Deleted Succesfully");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.error || "Something Went Wrong While Deleting Product");

        }
    },
    toggleFeaturedProduct: async (productId) => {
        set({ loading: true });
        try {
            const response = await axios.patch(`/products/${productId}`);
            //this will update the isFeatured prop of the product in the store
            set((prevProducts) => ({
                products: prevProducts.products.map((product) => product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product),
                loading: false,
            }));
            toast.success("Featured Status Updated Succesfully")
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.error || "Failed to Toggle Featured Product");
        }
    },

    fetchFeaturedProducts: async () => {
        set({ loading: true });
        try {
            const response = await axios.get('/products/featured');
            set({ products: response.data, loading: false });
        } catch (error) {
            set({ error: "failed to fetch products", loading: false });
            console.log("error fetching featured products", error);
        }
    },
}));