import Blockcarousel from "./design/Blockcarousel";
import { featureData } from "../data/featuredata";

export default function FeaturesSection() {
  return (
    <section className="relative max-w-full mx-auto py-24 px-4 md:px-8 lg:px-18 grid md:grid-cols-2 gap-12 lg:gap-20 items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Elemen dekoratif blur */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      {/* Carousel */}
      <div className="relative z-10 flex justify-center">
        <Blockcarousel
          items={featureData}
          baseWidth={480}
          autoplay
          autoplayDelay={3500}
          pauseOnHover
          loop
        />
      </div>

      {/* Deskripsi */}
      <div className="relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          Powerful Collaboration Features
        </h2>

        <p className="text-lg text-gray-300 leading-relaxed">
          Inversa memberikan sistem kolaborasi penulisan yang terstruktur.
          Draft dapat diedit secara bertahap, collaborator dapat memberikan
          kontribusi tanpa konflik, dan setiap perubahan tercatat dengan jelas.
        </p>

        <div className="mt-8 flex gap-6">
          <div>
            <span className="block text-3xl font-bold text-white">500+</span>
            <span className="text-sm text-gray-400">Active Users</span>
          </div>
          <div>
            <span className="block text-3xl font-bold text-white">50+</span>
            <span className="text-sm text-gray-400">Teams</span>
          </div>
        </div> 
      </div>
    </section>
  );
}