'use client'

import { SignIn } from '@clerk/nextjs'

export default function CustomSignIn() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
              card: 'shadow-lg',
            },
          }}
          routing='hash'
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  )
}