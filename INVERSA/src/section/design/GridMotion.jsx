import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const GridMotion = ({ items = [], gradientColor = "black" }) => {
  const gridRef = useRef(null);
  const rowRefs = useRef([]);

  const totalItems = 28;

  const defaultItems = Array.from(
    { length: totalItems },
    (_, i) => `Item ${i + 1}`
  );

  const combinedItems =
    items.length > 0 ? items.slice(0, totalItems) : defaultItems;

  useEffect(() => {
    gsap.ticker.lagSmoothing(0);

    const speeds = [0.25, 0.18, 0.22, 0.16];
    const positions = [0, 0, 0, 0];

    const update = () => {
      rowRefs.current.forEach((row, index) => {
        if (!row) return;

        const direction = index % 2 === 0 ? 1 : -1;

        positions[index] += speeds[index] * direction;

        if (positions[index] > 400) positions[index] = -400;
        if (positions[index] < -400) positions[index] = 400;

        gsap.set(row, {
          x: positions[index],
        });
      });
    };

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <div ref={gridRef} className="h-full w-full overflow-hidden">
      <section
        className="w-full h-screen overflow-hidden relative flex items-center justify-center"
        style={{
          background: `radial-gradient(circle, ${gradientColor} 0%, transparent 100%)`,
        }}
      >
        <div className="gap-4 flex-none relative w-[220vw] h-[200vh] grid grid-rows-4 grid-cols-1 rotate-[-15deg] origin-center z-[2]">

          {[...Array(4)].map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid gap-4 grid-cols-7"
              ref={(el) => (rowRefs.current[rowIndex] = el)}
              style={{ willChange: "transform" }}
            >
              {[...Array(7)].map((_, itemIndex) => {
                const content = combinedItems[rowIndex * 7 + itemIndex];

                return (
                  <div key={itemIndex} className="relative">
                    <div className="relative w-full h-full overflow-hidden rounded-[10px] bg-[#111] flex items-center justify-center text-white text-[1.5rem]">

                      {typeof content === "string" &&
                      content.startsWith("http") ? (
                        <div
                          className="w-full h-full bg-cover bg-center absolute top-0 left-0"
                          style={{
                            backgroundImage: `url(${content})`,
                          }}
                        />
                      ) : (
                        <div className="p-4 text-center z-[1]">
                          {content}
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>
          ))}

        </div>
      </section>
    </div>
  );
};

export default GridMotion;