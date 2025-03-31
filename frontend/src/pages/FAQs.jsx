export default function FAQs() {
    const questions = [
      { 
        question: "How do I list my property?", 
        answer: "You can list your property by contacting our agents or using our online portal." 
      },
      // Add more FAQs
    ];
  
    return (
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {questions.map((item, index) => (
            <div key={index} className="border-b pb-4">
              <h3 className="font-bold text-lg">{item.question}</h3>
              <p className="text-gray-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }