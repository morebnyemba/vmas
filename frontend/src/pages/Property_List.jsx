import React, { useEffect, useState } from 'react';
import { getProperties } from '../api/properties';
import PropertyCard from '../components/PropertyCard';
import FilterBar from '../components/FilterBar';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Frown, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function PropertyListing() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    min_price: '',
    max_price: '',
    bedrooms: '',
    property_type: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 12,
    total_count: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = {
          ...filters,
          page: pagination.page,
          page_size: pagination.page_size
        };
        
        Object.keys(params).forEach(key => {
          if (params[key] === '' || params[key] === null) {
            delete params[key];
          }
        });

        const data = await getProperties(params);
        
        if (Array.isArray(data)) {
          setProperties(data);
          setPagination(prev => ({ ...prev, total_count: data.length }));
        } else if (data.results) {
          setProperties(data.results);
          setPagination(prev => ({
            ...prev,
            total_count: data.count || 0
          }));
        } else {
          throw new Error('Invalid data format from API');
        }
      } catch (error) {
        console.error('Error loading properties:', error);
        setError(error.message || 'Failed to load properties');
        setProperties([]);
        
        if (error.response?.status === 401) {
          navigate('/signin');
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [filters, pagination.page, navigate]);

  const handleFilterChange = (newFilters) => {
    setPagination(prev => ({ ...prev, page: 1 }));
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading properties</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header and Filter Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
          Find Your Perfect Property
        </h1>
        <p className="text-muted-foreground mb-6">
          Browse our selection of premium properties tailored to your needs
        </p>
        
        <Card className="p-6">
          <FilterBar 
            onFilterChange={handleFilterChange} 
            initialValues={filters}
          />
        </Card>
      </div>
      
      {/* Results Count */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {pagination.total_count} {pagination.total_count === 1 ? 'Property' : 'Properties'} Found
          </h2>
          <p className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.page_size + 1}-
            {Math.min(pagination.page * pagination.page_size, pagination.total_count)} of {pagination.total_count}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden border">
              <Skeleton className="w-full h-48 rounded-none" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/5" />
                <Skeleton className="h-4 w-2/5" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.length > 0 ? (
              properties.map(property => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  onExpressInterest={() => {
                    // Handle express interest if needed
                  }}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <Frown className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No properties found</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  We couldn't find any properties matching your criteria. Try adjusting your filters or search again.
                </p>
                <div className="pt-4">
                  <Button
                    onClick={() => setFilters({
                      min_price: '',
                      max_price: '',
                      bedrooms: '',
                      property_type: ''
                    })}
                  >
                    Reset all filters
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.total_count > pagination.page_size && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                {Array.from({ length: Math.ceil(pagination.total_count / pagination.page_size) }, (_, i) => {
                  // Show only first, last, and pages around current page
                  if (
                    i === 0 || 
                    i === Math.ceil(pagination.total_count / pagination.page_size) - 1 ||
                    (i >= pagination.page - 3 && i <= pagination.page + 1)
                  ) {
                    return (
                      <Button
                        key={i}
                        variant={pagination.page === i + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(i + 1)}
                        className="w-10 h-10 p-0"
                      >
                        {i + 1}
                      </Button>
                    );
                  }
                  return null;
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page * pagination.page_size >= pagination.total_count}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}