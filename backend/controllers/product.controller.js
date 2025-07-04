import cloudinary from "../lib/cloudinary.js";
import { redis } from '../lib/redis.js';
import Product from "../models/product.model.js";


export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}); //retrieve all products
        res.json({ products });
    } catch (error) {
        console.log("error in getAllProducts controller", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = await redis.get("featured_products");
        if (featuredProducts) {
            return res.json(JSON.parse(featuredProducts));

        }
        //if not found in redis, fetch from mongoDB
        featuredProducts = await Product.find({ isFeatured: true }).lean(); //.lean() converts the mongoose document to a plain javascript object

        if (!featuredProducts) {
            return res.status(404).json({ message: "No Featured Products Exist Yet" });
        }

        //store in redis for future quick access
        await redis.set("featured_products", JSON.stringify(featuredProducts));
        res.json(featuredProducts);

    } catch (error) {
        console.log("error in getFeaturedProducts controller", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body;
        let cloudinaryResponse = null;

        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
        }
        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category
        })

        res.status(201).json(product);
    } catch (error) {
        console.log("error in createProduct controller", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });

    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product Not Found" });
        }

        if (product.image) {
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("Image Deleted from Cloudinary");
            } catch (error) {
                console.log("Error deleting image from Cloudinary", error);
            }
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
        console.log("error in deleteProduct controller", error.message);
    }
};

export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            { $sample: { size: 4 } }, //randomly select 4 products
            { $project: { _id: 1, name: 1, description: 1, price: 1, image: 1, } }
        ]);
        res.json(products);

    } catch (error) {
        console.log("error in getRecommendedProducts controller", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });

    }
}

export const getProductsByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const products = await Product.find({ category });
        res.json({ products });
    } catch (error) {
        console.log("error in getProductsByCategory controller", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();
            await updateFeaturedProductsCache(); //update redis cache
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: "Product Not Found" });
        }

    } catch (error) {
        console.log("error in toggleFeaturedProduct controller", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

async function updateFeaturedProductsCache() {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).lean();
        await redis.set("featured_products", JSON.stringify(featuredProducts));
    } catch (error) {
        console.log("Error Updating Featured Products Cache");
    }
}