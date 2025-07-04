import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUserStore } from '../stores/useUserStore';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { signup, loading } = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    signup(formData);
  }
  return (
    <div className='flex flex-col justify-center py-1 sm:px-6 lg:px-8'>
      <motion.div
        className='sm:mx-auto sm:w-full'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className='mt-2 text-center text-4xl font-extrabold text-emerald-500'>Create Your B&T Account!</h2>
      </motion.div>

      <motion.div>
        <p className='mt-2 text-center text-sm font-semibold text-emerald-500'>Become our member by answering the required fields below.</p>
      </motion.div>

      <motion.div
        className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >

        <div className='bg-teal-200 border-2 border-emerald-500 shadow-emerald-400 py-8 px-4 sm:rounded-lg sm:px-10'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Full Name*/}
            <div>
              <label htmlFor="name" className='block text-sm font-extrabold text-emerald-500'>Full Name</label>
              <div className='mt-1 relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <User className='h-5 w-5 text-emerald-500' aria-hidden='true' />
                </div>
                <input id='name' type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className='block w-full px-3 py-2 pl-10 bg-teal-100 border-2 border-emerald-500 rounded-md shadow-sm placeholder-emerald-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                  placeholder='e.g. John Doe'
                />
              </div>
            </div>
            {/* Email */}
            <div>
              <label htmlFor="email" className='block text-sm font-extrabold text-emerald-500'>Email Address</label>
              <div className='mt-1 relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Mail className='h-5 w-5 text-emerald-500' aria-hidden='true' />
                </div>
                <input id='email' type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className='block w-full px-3 py-2 pl-10 bg-teal-100 border-2 border-emerald-500 rounded-md shadow-sm placeholder-emerald-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                  placeholder='you@example.com'
                />
              </div>
            </div>
            {/* Password*/}
            <div>
              <label htmlFor="password" className='block text-sm font-extrabold text-emerald-500'>Password</label>
              <div className='mt-1 relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='h-5 w-5 text-emerald-500' aria-hidden='true' />
                </div>
                <input id='password' type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className='block w-full px-3 py-2 pl-10 bg-teal-100 border-2 border-emerald-500 rounded-md shadow-sm placeholder-emerald-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                  placeholder='••••••••••••••••'
                />
              </div>
            </div>
            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className='block text-sm font-extrabold text-emerald-500'>Confirm Password</label>
              <div className='mt-1 relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='h-5 w-5 text-emerald-500' aria-hidden='true' />
                </div>
                <input id='confirmPassword' type="password" required value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className='block w-full px-3 py-2 pl-10 bg-teal-100 border-2 border-emerald-500 rounded-md shadow-sm placeholder-emerald-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                  placeholder='••••••••••••••••'
                />
              </div>
            </div>
            {/* Submit Button */}
            <button
              type='submit'
              className='w-full flex justify-center py-2 px-4 border border-transparent 
							rounded-md shadow-sm text-sm font-semibold text-white bg-emerald-600
							 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
							  focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50 cursor-pointer'
              disabled={loading}>
              {loading ? (
                <>
                  <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                  Loading...
                </>
              ) : (
                <>
                  <UserPlus className='mr-2 h-5 w-5' aria-hidden='true' /> Sign Up
                </>
              )}
            </button>
          </form>

          <p className='mt-8 text-center text-sm text-emerald-500'>
            Already have an account?{" "}
            <Link to='/login' className='font-extrabold text-emerald-400 hover:underline'>
              Login Here <ArrowRight className='inline h-4 w-4' />
            </Link>
          </p>
        </div>

      </motion.div>
    </div>
  )
}

export default SignUpPage