import Blockcarousel from "./design/Blockcarousel";
import { howitWorksData } from "../data/howitworksdata";

export default function HowItWorksSection() {
  return (
    <section className="max-w-6xl mx-auto py-28 grid md:grid-cols-2 gap-20 items-center">

      {/* Description */}
      <div>
        <h2 className="text-4xl font-bold mb-6">
          How Inversa Works
        </h2>

        <p className="text-lg text-light-secondary dark:text-dark-secondary leading-relaxed">
          Mulai dari membuat project hingga publikasi final,
          Inversa menyediakan workflow yang jelas dan
          mudah dipahami untuk penulis dan collaborator.
        </p>
      </div>

      {/* Carousel */}
      <Blockcarousel
        items={howitWorksData}
        baseWidth={340}
        autoplay={false}
        loop
      />

    </section>
  );
}