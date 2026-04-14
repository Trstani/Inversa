import Blockcarousel from "./design/Blockcarousel";
import { howitWorksData } from "../data/howitworksdata";

export default function HowItWorksSection() {
  return (
    <section className="relative max-w-full mx-auto py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-20 items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Elemen dekoratif blur (dibalik posisinya untuk variasi) */}
      <div className="absolute top-0 right-0 w-48 sm:w-72 h-48 sm:h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-56 sm:w-96 h-56 sm:h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      {/* Deskripsi - Kiri */}
      <div className="relative z-10 order-2 md:order-1">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          How Inversa Works
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
          Mulai dari membuat project hingga publikasi final,
          Inversa menyediakan workflow yang jelas dan
          mudah dipahami untuk penulis dan collaborator.
        </p>

       <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-7 sm:h-8 w-7 sm:w-8 items-center justify-center rounded-full bg-purple-600/20 text-purple-300 font-bold text-xs sm:text-sm">1</span>
            <span className="text-xs sm:text-sm md:text-base text-gray-300">Buat project dan undang collaborator</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-7 sm:h-8 w-7 sm:w-8 items-center justify-center rounded-full bg-purple-600/20 text-purple-300 font-bold text-xs sm:text-sm">2</span>
            <span className="text-xs sm:text-sm md:text-base text-gray-300">Tulis dan revisi secara asyncron</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-7 sm:h-8 w-7 sm:w-8 items-center justify-center rounded-full bg-purple-600/20 text-purple-300 font-bold text-xs sm:text-sm">3</span>
            <span className="text-xs sm:text-sm md:text-base text-gray-300">Publikasi dengan satu klik</span>
          </div>
        </div>
      </div>

      {/* Carousel - Kanan */}
      <div className="relative z-10 flex justify-center order-1 md:order-2">
        <Blockcarousel
          items={howitWorksData}
          baseWidth={480}
          mobileBaseWidth={380}
          autoplay
          autoplayDelay={3500}
          pauseOnHover
          loop
        />
      </div>
    </section>
  );
}