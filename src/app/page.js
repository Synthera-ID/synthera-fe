export default function TestimonialPage() {
  const testimonials = [
    {
      name: "Sarah K.",
      role: "Creator, 5K members",
      initial: "S",
      text: "Synthera transformed how I manage my community! The analytics alone are worth the price.",
      isActive: false
    },
    {
      name: "Michael R.",
      role: "CTO, TechStart Inc.",
      initial: "M",
      text: "The API integration was incredibly smooth. We were up and running in under an hour.",
      isActive: true
    },
    {
      name: "Emily L.",
      role: "Educator, Online Academy",
      initial: "E",
      text: "Best membership platform I've used. The security features give me peace of mind.",
      isActive: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b0a15] text-white flex flex-col items-center justify-center p-8">
      <h2 className="text-4xl font-bold text-center mb-16">What Our Users Say</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {testimonials.map((item, index) => (
          <div 
            key={index}
            className={`rounded-2xl p-10 flex flex-col items-center text-center bg-[#13121d] transition-all duration-300 border ${
              item.isActive ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'border-[#1f1e2e]'
            }`}
          >
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-xl font-bold mb-6">
              {item.initial}
            </div>
            
            <p className="text-gray-400 italic text-lg leading-relaxed mb-8">
              "{item.text}"
            </p>
            
            <div>
              <h4 className="font-bold text-white text-lg">— {item.name}</h4>
              <p className="text-gray-500 text-sm mt-1">{item.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}