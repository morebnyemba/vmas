import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function FAQs() {
  const questions = [
    { 
      question: "How do I list my property with Visit Masvingo?", 
      answer: "You can list your property by contacting our agents directly or through our online portal. Simply visit our 'List Property' page, fill out the form with your property details, and one of our agents will contact you within 24 hours to complete the process." 
    },
    { 
      question: "What areas do you service in Masvingo?", 
      answer: "We cover all major areas in Masvingo including the city center, suburbs, and surrounding regions. Our agents have specialized knowledge of neighborhoods like Rhodene, Mucheke, and the new developments along Old Great North Road." 
    },
    { 
      question: "What fees are involved when buying a property?", 
      answer: "Our standard commission is 3% of the property value. Additional costs may include legal fees (typically 1-2%), transfer duty (varies by property value), and bond registration costs if you're financing through a bank. We provide a complete cost breakdown for every property." 
    },
    { 
      question: "How long does the buying process typically take?", 
      answer: "The timeline varies but typically takes 6-8 weeks from offer acceptance to transfer. This includes property inspections, securing financing (if needed), and the legal transfer process. We guide you through each step to ensure a smooth transaction." 
    },
    { 
      question: "Can I rent before buying to test the neighborhood?", 
      answer: "Absolutely! We offer short-term rental options in many of our listed properties. This allows you to experience the neighborhood before committing to a purchase. Ask your agent about our 'Try Before You Buy' program." 
    },
    { 
      question: "Do you provide property valuation services?", 
      answer: "Yes, our certified valuers provide comprehensive property valuations considering current market trends, location advantages, and property condition. Valuations start at $150 for residential properties." 
    },
    { 
      question: "What financing options are available?", 
      answer: "We partner with all major banks and financial institutions in Zimbabwe. Whether you're looking for mortgage options, payment plans, or developer financing, our financial advisors will help you find the best solution for your needs." 
    },
    { 
      question: "How do I schedule a property viewing?", 
      answer: "You can schedule viewings directly through our website by clicking the 'Schedule Viewing' button on any property listing, or by calling our office at +263 772 123 456. Viewings are available 7 days a week by appointment." 
    },
  ];

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="container py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-blue-600">
            Find answers to common questions about buying, selling, and renting properties in Masvingo
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {questions.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden transition-all"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-blue-50 transition-colors">
                  <span className="flex-1 text-left font-semibold text-blue-900">
                    {item.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-0 text-blue-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-16 text-center bg-white p-8 rounded-xl shadow-sm border border-blue-100">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Still have questions?</h3>
            <p className="text-blue-600 mb-6 max-w-2xl mx-auto">
              Our team is ready to help with any additional questions you may have about properties in Masvingo.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-4">
                Call Support: +263 772 123 456
              </Button>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4">
                Email Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}