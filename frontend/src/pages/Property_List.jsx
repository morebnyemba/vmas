function PropertyList() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto my-8 p-6 shadow-lg border border-gray-200 rounded-lg bg-white">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Property List</h2>
        </div>
        <div className="mb-4">
          <p className="text-gray-600">
            This is the property list page content.
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Check back later for more properties!</p>
        </div>
      </div>
    </div>
  );
}

export default PropertyList;