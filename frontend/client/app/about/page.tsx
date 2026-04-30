export default function About() {
  return (
    <div className="flex flex-col gap-12 md:gap-24 px-6 md:px-12 lg:px-24 py-16 bg-white-page min-h-screen">
      <div className="max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 md:mb-8">About <span className="text-cyan-500">Us</span></h1>
        <div className="h-1 w-24 bg-cyan-500 mb-8 md:mb-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="glass-card p-10 rounded-2xl relative transition-transform hover:-translate-y-2">
          <h2 className="text-3xl font-bold mb-6 text-glow-cyan">Our Mission</h2>
          <p className="text-xl leading-relaxed font-light">
            “Our mission is to democratize elite startup building by integrating predictive AI, psychological clarity, and a world-class investor network to propel founders from concept to market dominance at unprecedented speed”
          </p>
          <div className="absolute top-0 right-0 p-8 text-8xl text-cyan-500/20 font-serif">"</div>
        </div>

        <div className="glass-card p-10 rounded-2xl relative transition-transform hover:-translate-y-2">
          <h2 className="text-3xl font-bold mb-6 text-glow-orange text-[#FF5F00]">Our Vision</h2>
          <p className="text-xl leading-relaxed font-light">
            "To become the global standard for entrepreneurial success, where every visionary idea is met with the intelligence and capital required to change the world"
          </p>
          <div className="absolute top-0 right-0 p-8 text-8xl text-orange-500/20 font-serif">"</div>
        </div>
      </div>

      {/* Founder Section */}
      <section className="mt-8 md:mt-16 glass-card p-8 md:p-12 rounded-3xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">Meet The Founder</h2>
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-64 h-64 bg-gray-200 rounded-full shrink-0 border-4 border-cyan-500 relative overflow-hidden shadow-lg">
            {/* Image Placeholder */}
            <div className="w-full h-full flex items-center justify-center text-gray-500">[ Image ]</div>
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-2">John Doe</h3>
            <p className="text-cyan-600 font-bold mb-6 tracking-widest uppercase">Chief Executive Officer</p>
            <p className="text-lg leading-relaxed mb-6">
              With a background in deep tech and venture scouting, John founded The Propels to bridge the gap between young raw talent in India and actionable, revenue-generating reality. 
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
