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
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80"
          alt="Modern luxury home"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container px-4">
          <div className="max-w-2xl text-white">
            <h1 className="mb-6 text-4xl font-bold leading-tight lg:text-5xl">
              Find Your Dream Home with Ease
            </h1>
            <p className="mb-8 text-lg lg:text-xl">
              Discover premium properties in your ideal neighborhood. Modern living starts here.
            </p>

            {/* Search/CTA Section using shadcn components */}
            <div className="rounded-lg bg-white/20 p-6 backdrop-blur-sm">
              <div className="grid gap-4 md:grid-cols-3 grid-cols-1">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Buy/Rent</label>
                  <Select>
                    <SelectTrigger className="bg-white/80 text-gray-900">
                      <SelectValue placeholder="Buy/Rent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">Buy</SelectItem>
                      <SelectItem value="rent">Rent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Location</label>
                  <Input
                    placeholder="Enter city or neighborhood"
                    className="bg-white/80 text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Property Type</label>
                  <Select>
                    <SelectTrigger className="bg-white/80 text-gray-900">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-4">
                <Button className="py-6 text-lg hover:bg-blue-700 w-full">
                  Search Properties
                </Button>
                <Button
                  variant="outline"
                  className={`border-2 border-white bg-transparent py-6 text-lg text-white hover:bg-white/20 w-full`}
                >
                  Contact Agent
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}