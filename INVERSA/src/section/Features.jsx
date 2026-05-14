import Blockcarousel from "./design/Blockcarousel";
import { featureData } from "../data/featuredata";

export default function FeaturesSection() {
  return (
    <section className="bg-light-background dark:bg-dark-background py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* CAROUSEL */}
        <div className="flex justify-center order-2 lg:order-1">
          <Blockcarousel
            items={featureData}
            baseWidth={460}
            mobileBaseWidth={340}
            autoplay
            autoplayDelay={3500}
            pauseOnHover
            loop
          />
        </div>

        {/* TEXT */}
        <div className="order-1 lg:order-2">
          
          <span
            className="
            inline-flex items-center
            rounded-full
            border border-light-border dark:border-dark-border
            bg-light-surface dark:bg-dark-surface
            px-4 py-2
            text-xs font-medium
            text-light-secondary dark:text-dark-secondary
            "
          >
            Collaboration Features
          </span>

          <h2
            className="
            mt-6
            text-4xl md:text-5xl
            font-bold tracking-tight
            text-light-primary dark:text-dark-primary
            "
          >
            Powerful tools for
            collaborative writing.
          </h2>

          <p
            className="
            mt-5 max-w-xl
            text-base leading-relaxed
            text-light-secondary dark:text-dark-secondary
            "
          >
            Dari pembagian chapter,
            sistem collaborator,
            hingga workflow publish —
            INVERSA dibuat untuk menjaga
            proses menulis tetap terstruktur.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-6">
            
            <div>
              <p
                className="
                text-3xl font-bold
                text-light-primary dark:text-dark-primary
                "
              >
                500+
              </p>

              <p
                className="
                mt-1 text-sm
                text-light-secondary dark:text-dark-secondary
                "
              >
                Active Users
              </p>
            </div>

            <div>
              <p
                className="
                text-3xl font-bold
                text-light-primary dark:text-dark-primary
                "
              >
                50+
              </p>

              <p
                className="
                mt-1 text-sm
                text-light-secondary dark:text-dark-secondary
                "
              >
                Creative Teams
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}