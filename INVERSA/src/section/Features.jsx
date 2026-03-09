import Blockcarousel from "./design/Blockcarousel";
import { featureData } from "../data/featuredata";

export default function FeaturesSection() {
  return (
    <section className="max-w-6xl mx-auto py-28 grid md:grid-cols-2 gap-20 items-center">

      {/* Carousel */}
      <Blockcarousel
        items={featureData}
        baseWidth={340}
        autoplay
        autoplayDelay={3500}
        pauseOnHover
        loop
      />

      {/* Description */}
      <div>
        <h2 className="text-4xl font-bold mb-6">
          Powerful Collaboration Features
        </h2>

        <p className="text-lg text-light-secondary dark:text-dark-secondary leading-relaxed">
          Inversa memberikan sistem kolaborasi penulisan yang terstruktur.
          Draft dapat diedit secara bertahap, collaborator dapat memberikan
          kontribusi tanpa konflik, dan setiap perubahan tercatat dengan jelas.
        </p>
      </div>

    </section>
  );
}