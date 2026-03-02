export default function Services() {
  const services = [
    { title: 'Monetize', desc: 'Secure automated payment systems.', icon: 'M' },
    { title: 'Scale', desc: 'Cloud infrastructure ready for growth.', icon: 'S' },
    { title: 'Manage', desc: 'Intuitive dashboard for full control.', icon: 'C' }
  ];

  return (
    <section id="services" className="py-32 bg-[#0d0a1a]">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((item, i) => (
            <div key={i} className="group p-10 rounded-[2.5rem] bg-[#120f26] border border-white/5 hover:border-[#7c5dfa]/50 transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl bg-[#7c5dfa]/10 flex items-center justify-center mb-8 border border-[#7c5dfa]/20 group-hover:scale-110 transition-transform">
                <span className="text-[#7c5dfa] font-bold text-xl">{item.icon}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}