import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
// import { ReactComponent as EnviraIcon } from '../icons/envira-brands.svg';

import enviraIcon from '../icons/envira-brands.svg';

const Navbar = () => {
  const { user, logout } = useUserStore(); // This should be replaced with the actual user state from your store
  const isAdmin = user?.role === "admin";
  const { cart } = useCartStore();
  return (
    <header className="fixed top-0 left-0 w-full bg-emerald-50 bg-opacity-10 backdrop-blur-sm shadow-lg z-50 transition-all duration-300 border-b-2 border-emerald-500">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-emerald-400 space-x-1 items-center flex"
          >
            <span>Bloom&Thrive</span>
            <img src={enviraIcon} alt="Envira logo" className="w-5 h-6" />

          </Link>
          <nav className="flex flex-wrap items-center gap-4">
            <Link
              to={"/"}
              className="text-emerald-600 hover:text-emerald-400 transition duration-300 ease-in-out"
            >
              Home
            </Link>

            {/* User verified and this will direct to this statement */}
            {user && (
              <Link to={"/cart"} className="relative group">
                <ShoppingCart
                  className="inline-block mr-1 text-emerald-600 group-hover:text-emerald-400"
                  size={20}
                />
                <span className="hidden sm:inline">Cart</span>
                {cart.length > 0 && <span className="absolute -top-2 -left-3 bg-emerald-500 text-emerald-50 rounded-full px-2 py-1 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out">
                  {cart.length}
                </span>}
              </Link>
            )}

            {isAdmin && (
              <Link
                className="bg-emerald-600 hover:bg-emerald-400 text-white px-3 py-2 rounded-md font-medium transition duration-300 ease-in-out flex items-center"
                to={'/secret-dashboard'}>
                <Lock className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {user ? (
              <button onClick={logout} className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-md flex items-center transition duration-300 ease-in-out cursor-pointer">
                <LogOut className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            ) : (
              <>
                <Link to={"/signup"} className="bg-emerald-600 hover:bg-emerald-400 text-white px-3 py-2 rounded-md flex items-center justify-center font-medium transition duration-300 ease-in-out ">
                  <UserPlus className="mr-2" size={18} />
                  Sign Up</Link>
                <Link to={"/login"} className="bg-emerald-600 hover:bg-emerald-400 text-white px-3 py-2 rounded-md flex items-center justify-center font-medium transition duration-300 ease-in-out ">
                  <LogIn className="mr-2" size={18} />
                  Log In</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
