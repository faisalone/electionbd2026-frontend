export default function MarketBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Floating Blobs */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
      <div className="absolute top-40 -right-20 w-96 h-96 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-pink-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      
      {/* Decorative Circles */}
      <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-[#C8102E]/20 rounded-full"></div>
      <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-500/20 rounded-full"></div>
      <div className="absolute top-2/3 left-1/4 w-2 h-2 bg-purple-500/20 rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-green-500/20 rounded-full"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[64px_64px]"></div>
    </div>
  );
}
