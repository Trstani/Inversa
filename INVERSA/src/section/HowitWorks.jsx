import Blockcarousel from "./design/Blockcarousel";
import { howitWorksData } from "../data/howitworksdata";

export default function HowItWorksSection() {
  return (
    <section className="relative max-w-full mx-auto py-24 px-4 md:px-8 lg:px-18 grid md:grid-cols-2 gap-12 lg:gap-20 items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Elemen dekoratif blur (dibalik posisinya untuk variasi) */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      {/* Deskripsi - Kiri */}
      <div className="relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          How Inversa Works
        </h2>

        <p className="text-lg text-gray-300 leading-relaxed">
          Mulai dari membuat project hingga publikasi final,
          Inversa menyediakan workflow yang jelas dan
          mudah dipahami untuk penulis dan collaborator.
        </p>

       <div className="mt-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600/20 text-purple-300 font-bold">1</span>
            <span className="text-gray-300">Buat project dan undang collaborator</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600/20 text-purple-300 font-bold">2</span>
            <span className="text-gray-300">Tulis dan revisi secara asyncron</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600/20 text-purple-300 font-bold">3</span>
            <span className="text-gray-300">Publikasi dengan satu klik</span>
          </div>
        </div>
      </div>

      {/* Carousel - Kanan */}
      <div className="relative z-10 flex justify-center">
        <Blockcarousel
          items={howitWorksData}
          baseWidth={480}
          autoplay
          autoplayDelay={3500}
          pauseOnHover
          loop
        />
      </div>
    </section>
  );
}