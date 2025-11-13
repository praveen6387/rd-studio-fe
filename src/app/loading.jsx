export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 via-purple-500/20 to-indigo-500/20 animate-pulse"></div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full animate-float ${
              i % 4 === 0
                ? "bg-amber-300/60"
                : i % 4 === 1
                ? "bg-rose-300/60"
                : i % 4 === 2
                ? "bg-pink-300/60"
                : "bg-yellow-200/60"
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          ></div>
        ))}

        {/* Light Beams */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-amber-400/30 to-transparent rounded-full animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-rose-400/30 to-transparent rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 text-center">
        {/* Logo/Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>

        {/* Loading Text */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
          RD Photo
        </h1>
        <p className="text-xl text-gray-300 mb-8 font-light">Loading beautiful moments...</p>

        {/* Loading Spinner */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Outer Ring */}
            <div className="w-16 h-16 border-4 border-gray-600/30 rounded-full"></div>

            {/* Inner Spinning Ring */}
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-rose-500 border-r-pink-500 rounded-full animate-spin"></div>

            {/* Center Dot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="w-full bg-gray-700/50 rounded-full h-1 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 rounded-full animate-progress"></div>
          </div>
        </div>
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <div className="w-1 h-1 bg-rose-400 rounded-full animate-pulse"></div>
          <span>Professional Photography</span>
          <div className="w-1 h-1 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
        </div>
      </div>
    </div>
  );
}
