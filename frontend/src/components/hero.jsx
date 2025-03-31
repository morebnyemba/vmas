import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative h-screen w-full">
      {/* Background Image with Blue Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9"
          alt="Modern luxury home"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-blue-900/40 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center text-white">
            <h1 className="mb-6 text-4xl font-bold leading-tight drop-shadow-lg lg:text-6xl">
              Discover Your Perfect Property
            </h1>
            <p className="mx-auto mb-8 max-w-xl text-lg lg:text-xl lg:leading-relaxed">
              Experience seamless property hunting with our curated selection of premium homes
            </p>
          </div>

          {/* Search Form Container */}
          <div className="mx-auto mt-8 max-w-4xl">
            <div className="rounded-xl bg-white/20 p-6 backdrop-blur-lg border border-blue-100/30">
              <div className="grid gap-4 md:grid-cols-3">
                {/* Transaction Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-blue-50">Transaction Type</label>
                  <Select>
                    <SelectTrigger className="bg-blue-50/80 text-blue-900 hover:bg-blue-100">
                      <SelectValue placeholder="Buy or Rent?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy" className="text-blue-900">Buy Property</SelectItem>
                      <SelectItem value="rent" className="text-blue-900">Rent Property</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-blue-50">Location</label>
                  <Input
                    placeholder="Enter area or city"
                    className="bg-blue-50/80 text-blue-900 placeholder-blue-500 focus:border-blue-300"
                  />
                </div>

                {/* Property Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-blue-50">Property Type</label>
                  <Select>
                    <SelectTrigger className="bg-blue-50/80 text-blue-900 hover:bg-blue-100">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house" className="text-blue-900">Houses</SelectItem>
                      <SelectItem value="apartment" className="text-blue-900">Apartments</SelectItem>
                      <SelectItem value="villa" className="text-blue-900">Villas</SelectItem>
                      <SelectItem value="commercial" className="text-blue-900">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <Button className="h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700">
                  Explore Properties
                </Button>
                <Button
                  variant="outline"
                  className="h-12 border-2 border-blue-200 text-blue-900 hover:bg-blue-50/50"
                >
                  Connect with Agent
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}