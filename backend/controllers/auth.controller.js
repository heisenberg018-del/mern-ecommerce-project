import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// JWT Tokens
const generateToken = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15min',
    });

    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    });

    return { accessToken, refreshToken };
}

const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refresh_token:${userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60); //7 days expiration
}

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true, //prevent xss attacks
        secure: process.env.NODE_ENV === "production", //only send cookie over https in production
        sameSite: "strict", //prevent csrf attacks
        maxAge: 15 * 60 * 1000,
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, //prevent xss attacks
        secure: process.env.NODE_ENV === "production", //only send cookie over https in production
        sameSite: "strict", //prevent csrf attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, //7days expiration
    })
}

//register account
export const signup = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User Already Exists" });
        }
        const user = await User.create({ name, email, password });

        // JWT Token Generation
        const { accessToken, refreshToken } = generateToken(user._id);
        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken); // Set cookies in the response

        res.status(201).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }, message: "User Registration Successful"
        });
    } catch (error) {
        console.log(error.message, "Something went wrong in signup controller");
        res.status(500).json({ message: error.message });
    }
}

//login accounts
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            const { accessToken, refreshToken } = generateToken(user._id);
            await storeRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken);

            res.json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                message: "Login Successful"
            })
        } else {
            res.status(400).json({ message: "Invalid Email Address or Password" });
        }

    } catch (error) {
        console.log(error.message, "Something went wrong in login controller");
        res.status(500).json({ message: error.message });
    }
}

//logout account / kill session with tokens
export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`refresh_token:${decoded.userId}`);
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.json({ message: "Logged Out Successfully" });
    } catch (error) {
        console.log(error.message, "Something went wrong in logout controller");
        res.status(500).json({ message: "Internal Server Error", error: error.message });

    }

}
//this will refresh the access token 
export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "No Refresh Token Provided" });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

        if (storedToken !== refreshToken) {
            return res.status(401).json({ message: "Invalid Refresh Token" });
        }

        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15mins' });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

        res.json({ message: "Token Refreshed Successfully" });
    } catch (error) {
        console.log("Error in refreshToken controller", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });

    }
}


export const getProfile = async (req, res) => {
    try {
        res.json(req.user);

    } catch (error) {
        console.log(error.message, "Something went wrong in getProfile controller");
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

