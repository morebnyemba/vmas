// src/pages/Buy.jsx
export default function BuyPage() {
    const properties = [
      { id: 1, title: "Luxury Villa", price: 350000, beds: 4, baths: 3 },
      { id: 2, title: "Modern Apartment", price: 180000, beds: 2, baths: 2 },
      { id: 3, title: "Suburban Home", price: 275000, beds: 3, baths: 2 },
    ];
  
    return (
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8">Properties For Sale</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {properties.map(property => (
            <div key={property.id} className="border rounded-lg p-4 shadow-sm">
              <div className="h-48 bg-blue-100 mb-4 rounded"></div>
              <h2 className="text-xl font-bold">{property.title}</h2>
              <p className="text-blue-600 font-bold">${property.price.toLocaleString()}</p>
              <p>{property.beds} Beds, {property.baths} Baths</p>
            </div>
          ))}
        </div>
      </div>
    );
  }