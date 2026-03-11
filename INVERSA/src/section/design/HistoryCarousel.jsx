import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import CardProjectMini from "../../components/CardProjectMini";

const DRAG_BUFFER = 20;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 };

function CarouselItem({ project, index, itemWidth, trackItemOffset, x, transition }) {

  const range = [
    -(index + 1) * trackItemOffset,
    -index * trackItemOffset,
    -(index - 1) * trackItemOffset
  ];

  const rotateY = useTransform(x, range, [90, 0, -90], { clamp: false });

  return (
    <motion.div
      className="relative shrink-0 overflow-hidden cursor-grab active:cursor-grabbing"
      style={{
        width: itemWidth,
        rotateY
      }}
      transition={transition}
    >
      <CardProjectMini project={project} />
    </motion.div>
  );
}

export default function HistoryCarousel({ history = [] }) {

  const baseWidth = 300;
  const containerPadding = 16;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;

  const loop = true;

  const itemsForRender = useMemo(() => {
    if (!loop) return history;
    if (history.length === 0) return [];
    return [history[history.length - 1], ...history, history[0]];
  }, [history]);

  const [position, setPosition] = useState(loop ? 1 : 0);

  const x = useMotionValue(0);

  const [isAnimating, setIsAnimating] = useState(false);
  const [isJumping, setIsJumping] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    const start = loop ? 1 : 0;
    setPosition(start);
    x.set(-start * trackItemOffset);
  }, []);

  const effectiveTransition = isJumping ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationStart = () => setIsAnimating(true);

  const handleAnimationComplete = () => {

    if (!loop || itemsForRender.length <= 1) {
      setIsAnimating(false);
      return;
    }

    const lastCloneIndex = itemsForRender.length - 1;

    if (position === lastCloneIndex) {

      setIsJumping(true);

      const target = 1;
      setPosition(target);
      x.set(-target * trackItemOffset);

      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });

      return;
    }

    if (position === 0) {

      setIsJumping(true);

      const target = history.length;
      setPosition(target);
      x.set(-target * trackItemOffset);

      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });

      return;
    }

    setIsAnimating(false);
  };

  const handleDragEnd = (_, info) => {

    if (isAnimating) return;

    const { offset, velocity } = info;

    const direction =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
        ? -1
        : 0;

    if (direction === 0) return;

    setPosition((prev) => {
      const next = prev + direction;
      const max = itemsForRender.length - 1;
      return Math.max(0, Math.min(next, max));
    });
  };

  const activeIndex =
    history.length === 0
      ? 0
      : (position - 1 + history.length) % history.length;

  if (history.length === 0) {
    return (
      <p className="text-sm opacity-70">
        Your reading history will appear here
      </p>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden p-4"
      style={{
        width: `${baseWidth}px`
      }}
    >

      <motion.div
        className="flex"
        drag={isAnimating ? false : "x"}
        style={{
          gap: `${GAP}px`,
          perspective: 1000,
          perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`,
          x
        }}
        animate={{
          x: -(position * trackItemOffset)
        }}
        transition={effectiveTransition}
        onDragEnd={handleDragEnd}
        onAnimationStart={handleAnimationStart}
        onAnimationComplete={handleAnimationComplete}
      >

        {itemsForRender.map((project, index) => (

          <CarouselItem
            key={`${project?.id ?? index}-${index}`}
            project={project}
            index={index}
            itemWidth={itemWidth}
            trackItemOffset={trackItemOffset}
            x={x}
            transition={effectiveTransition}
          />

        ))}

      </motion.div>

      {/* indicator */}

      <div className="flex w-full justify-center mt-4">

        <div className="flex gap-2">

          {history.map((_, index) => (

            <motion.button
              key={index}
              className={`h-2 rounded-full cursor-pointer transition-all ${
                activeIndex === index
                  ? "w-6 bg-indigo-400"
                  : "w-2 bg-white/30 hover:bg-white/50"
              }`}
              animate={{
                scale: activeIndex === index ? 1.2 : 1
              }}
              transition={{ duration: 0.15 }}
              onClick={() => setPosition(index + 1)}
            />

          ))}

        </div>

      </div>

    </div>
  );
}