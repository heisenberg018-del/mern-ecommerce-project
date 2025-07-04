import Coupon from "../models/coupon.model.js";
export const getCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });
        res.json(coupon || null); // Return null if no coupon is found
    } catch (error) {
        console.log("error in getCoupon controller", error.message);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code: code, userId: req.user._id, isActive: true });
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon Not Found or Invalid' });
        }

        if (coupon.expirationDate < new Date()) {
            coupon.isActive = false;
            await coupon.save();
            return res.status(400).json({ message: "Coupon is Expired" });
        }

        res.json({
            message: "Coupon is Valid, will then Proceed",
            code: coupon.code,
            discountPercentage: coupon.discountPercentage,
        })
    } catch (error) {
        console.log("error in validateCoupon controller", error.message);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}