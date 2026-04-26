// Export the About page component
export default function About() {
  // Returns the JSX for the about section
  return (
    // Main container with vertical spacing and padding
    <div className="flex flex-col gap-12 md:gap-24 px-6 md:px-12 lg:px-24 py-16 bg-white-page min-h-screen">
      
      {/* Title Section */}
      <div className="max-w-4xl">
        {/* Main heading with highlight */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 md:mb-8">About <span className="text-cyan-500">Us</span></h1>
        {/* Decorative horizontal line */}
        <div className="h-1 w-24 bg-cyan-500 mb-8 md:mb-12" />
      </div>

      {/* Mission & Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        
        {/* Mission Card */}
        <div className="glass-card p-10 rounded-2xl relative transition-transform hover:-translate-y-2">
          {/* Subheading with glowing effect */}
          <h2 className="text-3xl font-bold mb-6 text-glow-cyan">Our Mission</h2>
          {/* Mission statement text */}
          <p className="text-xl leading-relaxed font-light">
            “Our mission is to democratize elite startup building by integrating predictive AI, psychological clarity, and a world-class investor network to propel founders from concept to market dominance at unprecedented speed”
          </p>
          {/* Decorative quote mark background */}
          <div className="absolute top-0 right-0 p-8 text-8xl text-cyan-500/20 font-serif">"</div>
        </div>

        {/* Vision Card */}
        <div className="glass-card p-10 rounded-2xl relative transition-transform hover:-translate-y-2">
          {/* Subheading with orange highlight */}
          <h2 className="text-3xl font-bold mb-6 text-glow-orange text-[#FF5F00]">Our Vision</h2>
          {/* Vision statement text */}
          <p className="text-xl leading-relaxed font-light">
            "To become the global standard for entrepreneurial success, where every visionary idea is met with the intelligence and capital required to change the world"
          </p>
          {/* Decorative quote mark background */}
          <div className="absolute top-0 right-0 p-8 text-8xl text-orange-500/20 font-serif">"</div>
        </div>
      </div>

      {/* Founder Section - Highlighting leadership */}
      <section className="mt-8 md:mt-16 glass-card p-8 md:p-12 rounded-3xl">
        {/* Section title */}
        <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">Meet The Founder</h2>
        {/* Founder details container */}
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Profile Picture Placeholder */}
          <div className="w-64 h-64 bg-gray-200 rounded-full shrink-0 border-4 border-cyan-500 relative overflow-hidden shadow-lg">
            {/* Display placeholder text until real image is provided */}
            <div className="w-full h-full flex items-center justify-center text-gray-500">[ Image ]</div>
          </div>
          {/* Founder Bio Text */}
          <div>
            {/* Name */}
            <h3 className="text-3xl font-bold mb-2">John Doe</h3>
            {/* Title / Role */}
            <p className="text-cyan-600 font-bold mb-6 tracking-widest uppercase">Chief Executive Officer</p>
            {/* Bio paragraph */}
            <p className="text-lg leading-relaxed mb-6">
              With a background in deep tech and venture scouting, John founded The Propels to bridge the gap between young raw talent in India and actionable, revenue-generating reality. 
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
