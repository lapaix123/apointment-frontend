import React from 'react';

function ForgetPassword() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 space-y-8 white:bg-neutral-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-black">Forgot password?</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
            Remember your password?{' '}
            <a href="/" className="text-blue-600 hover:underline">
              Sign in here
            </a>
          </p>
        </div>

        <form className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Enter your email"
              aria-describedby="email-error"
            />
            <p className="hidden text-xs text-red-600" id="email-error">Please include a valid email address so we can get back to you</p>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reset password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgetPassword;
