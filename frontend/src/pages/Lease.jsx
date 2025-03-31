import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LeasePage() {
  const leaseOptions = [
    { type: "Residential", term: "1-2 Years", deposit: "1 Month" },
    { type: "Commercial", term: "3-5 Years", deposit: "2-3 Months" },
    { type: "Agricultural", term: "5+ Years", deposit: "6 Months" },
    { type: "Short-Term", term: "<1 Year", deposit: "1 Month" },
  ];

  return (
    <div className="container py-12">
      <div className="flex items-center gap-4 mb-8">
        <ClipboardList className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-blue-900">Lease Options</h1>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                Lease Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                Typical Term
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                Security Deposit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaseOptions.map((option, index) => (
              <tr key={index} className="hover:bg-blue-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  {option.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {option.term}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {option.deposit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button variant="outline" size="sm">
                    Inquire
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Lease Agreement Services</h2>
        <p className="mb-4">
          Our legal team can prepare comprehensive lease agreements tailored to your specific needs.
        </p>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Request Lease Document
        </Button>
      </div>
    </div>
  );
}