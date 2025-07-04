import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).json({ message: "Unauthorized. Cannot Proceed without Access Token" })
        }
        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded.userId).select("-password");

            if (!user) {
                return res.status(401).json({ message: "Unauthorized. User Not Found" });
            }
            req.user = user;
            next();
            
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Unauthorized. Access Token Expired" });
            }

            throw error; // rethrow the error to be caught in the outer catch block
        }

    } catch (error) {
        console.log("error in protectRoute middleware", error.message);
        res.status(401).json({ message: "Unauthorized. Invalid Access Token", error: error.message });

    }
}

export const adminRoute = async (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ message: "Forbidden. Admin Access Required" });
    }
}