import React from 'react';

function Services() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto my-8 p-6 shadow-lg border border-gray-200 rounded-lg bg-white relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Under Development</h2>
          </div>
          <div className="mb-4">
            <p className="text-gray-600">
              This section of the site is currently under development and is constantly being updated. Please check back later for more content.
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Thank you for your patience!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;