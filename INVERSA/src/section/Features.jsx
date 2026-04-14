import Blockcarousel from "./design/Blockcarousel";
import { featureData } from "../data/featuredata";

export default function FeaturesSection() {
  return (
    <section className="relative max-w-full mx-auto py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-20 items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Elemen dekoratif blur */}
      <div className="absolute top-0 left-0 w-48 sm:w-72 h-48 sm:h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-56 sm:w-96 h-56 sm:h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      {/* Carousel */}
      <div className="relative z-10 flex justify-center order-2 md:order-1">
        <Blockcarousel
          items={featureData}
          baseWidth={480}
          mobileBaseWidth={380}
          autoplay
          autoplayDelay={3500}
          pauseOnHover
          loop
        />
      </div>

      {/* Deskripsi */}
      <div className="relative z-10 order-1 md:order-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          Powerful Collaboration Features
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
          Inversa memberikan sistem kolaborasi penulisan yang terstruktur.
          Draft dapat diedit secara bertahap, collaborator dapat memberikan
          kontribusi tanpa konflik, dan setiap perubahan tercatat dengan jelas.
        </p>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-6 sm:gap-8">
          <div className="flex-1">
            <span className="block text-2xl sm:text-3xl font-bold text-white">500+</span>
            <span className="text-xs sm:text-sm text-gray-400">Active Users</span>
          </div>
          <div className="flex-1">
            <span className="block text-2xl sm:text-3xl font-bold text-white">50+</span>
            <span className="text-xs sm:text-sm text-gray-400">Teams</span>
          </div>
        </div> 
      </div>
    </section>
  );
}