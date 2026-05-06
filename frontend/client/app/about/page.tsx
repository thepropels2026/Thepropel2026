export default function About() {
  return (
    <div className="flex flex-col gap-12 md:gap-24 px-6 md:px-12 lg:px-24 py-24 bg-slate-50 text-[rgba(0,0,0,0.9)] font-inter min-h-screen">
      <div className="max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8">About <span className="text-cyan-600">Us</span></h1>
        <div className="h-1 w-24 bg-cyan-600 mb-8 md:mb-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="bg-white border border-slate-200 shadow-sm p-10 rounded-2xl relative transition-transform hover:-translate-y-1">
          <h2 className="text-2xl font-bold mb-6 text-cyan-600">Our Mission</h2>
          <p className="text-lg leading-relaxed font-medium text-[rgba(0,0,0,0.7)]">
            “Our mission is to democratize elite startup building by integrating predictive AI, psychological clarity, and a world-class investor network to propel founders from concept to market dominance at unprecedented speed”
          </p>
          <div className="absolute top-0 right-0 p-8 text-7xl text-slate-100 font-serif">"</div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm p-10 rounded-2xl relative transition-transform hover:-translate-y-1">
          <h2 className="text-2xl font-bold mb-6 text-[#FF5F00]">Our Vision</h2>
          <p className="text-lg leading-relaxed font-medium text-[rgba(0,0,0,0.7)]">
            "To become the global standard for entrepreneurial success, where every visionary idea is met with the intelligence and capital required to change the world"
          </p>
          <div className="absolute top-0 right-0 p-8 text-7xl text-slate-100 font-serif">"</div>
        </div>
      </div>

      {/* Founder Section */}
      <section className="mt-8 md:mt-16 bg-white border border-slate-200 shadow-sm p-8 md:p-12 rounded-3xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center">Meet The Founder</h2>
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-64 h-64 bg-slate-50 rounded-full shrink-0 border-4 border-slate-100 shadow-inner relative overflow-hidden">
            {/* Image Placeholder */}
            <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest text-xs">[ Image ]</div>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">John Doe</h3>
            <p className="text-cyan-600 font-bold mb-6 text-sm tracking-wide">Chief Executive Officer</p>
            <p className="text-base leading-relaxed mb-6 text-[rgba(0,0,0,0.6)] font-medium">
              With a background in deep tech and venture scouting, John founded The Propels to bridge the gap between young raw talent in India and actionable, revenue-generating reality. 
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
