import { create } from 'zustand';
import axios from '../lib/axios';
import { toast } from 'react-hot-toast';

export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,

    signup: async ({ name, email, password, confirmPassword }) => {
        set({ loading: true });

        if (password !== confirmPassword) {
            set({ loading: false });
            return toast.error("Passwords Doesn't Match");
        }

        if (password.length < 6) {
            set({ loading: false });
            return toast.error("Cannot Proceed. Password must be at least 6 Characters Long.");
        }

        try {
            const res = await axios.post('/auth/signup', { name, email, password });
            set({ user: res.data, loading: false })
            toast.success("You are now Registered. You may now Log In!");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "Something Went Wrong, Please Try Again");
        }
    },

    login: async ({ email, password }) => {
        set({ loading: true });
        try {
            const res = await axios.post('/auth/login', { email, password });
            await get().checkAuth();
            set({ user: res.data, loading: false });
            toast.success("Login successful!");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "Something Went Wrong, Please Try Again");
        }
    },

    logout: async () => {
        try {
            await axios.post('/auth/logout');
            set({ user: null })
            toast.success("You are now Logged Out!");
        } catch (error) {
            toast.error(error.response.data.message || "Something Went Wrong During Log Out");
        }
    },

    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            const response = await axios.get('/auth/profile');
            set({ user: response.data, checkingAuth: false });
        } catch (error) {
            console.log(error.message);
            set({ checkingAuth: false, user: null });
        }
    },

    refreshToken: async () => {
        // Prevent multiple simultaneous refresh attempts
        if (get().checkingAuth) return;
        set({ checkingAuth: true });
        try {
            const response = await axios.get('/auth/refresh-token');
            set({ checkingAuth: false });
            return response.data;
        } catch (error) {
            set({ user: null, checkingAuth: false });
            throw error;
        }
    }

}));

//axios interceptor to add token to requests
let refreshPromise = null;

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !['/auth/login', '/auth/signup'].some(path => originalRequest.url.includes(path))
        ) {
            originalRequest._retry = true;
            try {   
                if (refreshPromise) {
                    // If a refresh is already in progress, wait for it to complete
                    await refreshPromise;
                    return axios(originalRequest);
                }
                // Start a new refresh promise
                refreshPromise = useUserStore.getState().refreshToken();
                await refreshPromise;
                refreshPromise = null;

                return axios(originalRequest);
                
            } catch (refreshError) {
                useUserStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
