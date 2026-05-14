import Blockcarousel from "./design/Blockcarousel";
import { howitWorksData } from "../data/howitworksdata";

export default function HowItWorksSection() {
  return (
    <section className="bg-light-surface dark:bg-dark-surface py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* TEXT */}
        <div>
          <span
            className="
            inline-flex items-center
            rounded-full
            border border-light-border dark:border-dark-border
            bg-light-background dark:bg-dark-background
            px-4 py-2
            text-xs font-medium
            text-light-secondary dark:text-dark-secondary
            "
          >
            Writing Workflow
          </span>

          <h2
            className="
            mt-6
            text-4xl md:text-5xl
            font-bold tracking-tight
            text-light-primary dark:text-dark-primary
            "
          >
            Structured collaboration,
            built for writers.
          </h2>

          <p
            className="
            mt-5 max-w-xl
            text-base leading-relaxed
            text-light-secondary dark:text-dark-secondary
            "
          >
            INVERSA membantu penulis dan collaborator
            bekerja dalam workflow yang jelas,
            terorganisir, dan nyaman untuk proyek
            jangka panjang.
          </p>

          <div className="mt-10 space-y-5">
            {[
              "Create project and invite collaborators",
              "Write and revise chapters asynchronously",
              "Publish your work in one connected flow",
            ].map((text, index) => (
              <div
                key={index}
                className="flex items-center gap-4"
              >
                <div
                  className="
                  flex h-9 w-9 items-center justify-center
                  rounded-full
                  bg-light-accent/10 dark:bg-dark-accent/10
                  text-light-accent dark:text-dark-accent
                  font-semibold text-sm
                  "
                >
                  {index + 1}
                </div>

                <p
                  className="
                  text-sm md:text-base
                  text-light-secondary dark:text-dark-secondary
                  "
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CAROUSEL */}
        <div className="flex justify-center">
          <Blockcarousel
            items={howitWorksData}
            baseWidth={460}
            mobileBaseWidth={340}
            autoplay
            autoplayDelay={3500}
            pauseOnHover
            loop
          />
        </div>
      </div>
    </section>
  );
}