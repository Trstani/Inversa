import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";

const DRAG_BUFFER = 20;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 };

function CarouselItem({
  item,
  index,
  itemWidth,
  round,
  trackItemOffset,
  x,
  transition
}) {
  const range = [
    -(index + 1) * trackItemOffset,
    -index * trackItemOffset,
    -(index - 1) * trackItemOffset
  ];

  const rotateY = useTransform(x, range, [90, 0, -90], { clamp: false });

  const Icon = item.icon;

  return (
    <motion.div
      className={`relative shrink-0 flex flex-col ${
        round
          ? "items-center justify-center text-center bg-[#060010]"
          : "items-start justify-between bg-[#4a20ac] border border-[#4322d3] rounded-[12px]"
      } overflow-hidden cursor-grab active:cursor-grabbing`}
      style={{
        width: itemWidth,
        height: round ? itemWidth : "100%",
        rotateY,
        ...(round && { borderRadius: "50%" })
      }}
      transition={transition}
    >
      <div className={`${round ? "p-0 m-0" : "mb-4 p-5"}`}>
        <span className="flex h-[32px] w-[32px] items-center justify-center rounded-lg bg-[#060010] text-white">
            {Icon && <Icon className="w-5 h-5" />}
        </span>
      </div>

      <div className="p-5">
        <div className="mb-1 font-black text-lg text-white">
          {item.title}
        </div>

        <p className="text-sm text-white">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function Carousel({
  items = [],
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  round = false
}) {
  const containerPadding = 16;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;

  const itemsForRender = useMemo(() => {
    if (!loop) return items;
    if (items.length === 0) return [];
    return [items[items.length - 1], ...items, items[0]];
  }, [items, loop]);

  const [position, setPosition] = useState(loop ? 1 : 0);

  const x = useMotionValue(0);

  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isJumping, setIsJumping] = useState(false);

  const containerRef = useRef(null);

  // hover pause
  useEffect(() => {
    if (!pauseOnHover || !containerRef.current) return;

    const el = containerRef.current;

    const enter = () => setIsHovered(true);
    const leave = () => setIsHovered(false);

    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);

    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, [pauseOnHover]);

  // autoplay
  useEffect(() => {
    if (!autoplay) return;
    if (itemsForRender.length <= 1) return;
    if (pauseOnHover && isHovered) return;

    const timer = setInterval(() => {
      if (!isAnimating) {
        setPosition((prev) =>
          Math.min(prev + 1, itemsForRender.length - 1)
        );
      }
    }, autoplayDelay);

    return () => clearInterval(timer);
  }, [
    autoplay,
    autoplayDelay,
    isHovered,
    pauseOnHover,
    itemsForRender.length,
    isAnimating
  ]);

  // initial position (run once)
  useEffect(() => {
    const start = loop ? 1 : 0;
    setPosition(start);
    x.set(-start * trackItemOffset);
  }, []);

  // safety non-loop
  useEffect(() => {
    if (!loop && position > itemsForRender.length - 1) {
      setPosition(itemsForRender.length - 1);
    }
  }, [position, itemsForRender.length, loop]);

  const effectiveTransition = isJumping
    ? { duration: 0 }
    : SPRING_OPTIONS;

  const handleAnimationStart = () => {
    setIsAnimating(true);
  };

  const handleAnimationComplete = () => {
    if (!loop || itemsForRender.length <= 1) {
      setIsAnimating(false);
      return;
    }

    const lastCloneIndex = itemsForRender.length - 1;

    // forward loop
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

    // backward loop
    if (position === 0) {
      setIsJumping(true);

      const target = items.length;

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

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left:
            -trackItemOffset *
            Math.max(itemsForRender.length - 1, 0),
          right: 0
        }
      };

  const activeIndex =
    items.length === 0
      ? 0
      : loop
      ? (position - 1 + items.length) % items.length
      : Math.min(position, items.length - 1);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden p-4 ${
        round
          ? "rounded-full border border-white"
          : "rounded-[24px] border border-[#4a20ac]"
      }`}
      style={{
        width: `${baseWidth}px`,
        ...(round && { height: `${baseWidth}px` })
      }}
    >
      <motion.div
        className="flex"
        drag={isAnimating ? false : "x"}
        {...dragProps}
        style={{
          gap: `${GAP}px`,
          perspective: 1000,
          perspectiveOrigin: `${
            position * trackItemOffset + itemWidth / 2
          }px 50%`,
          x
        }}
        animate={{ x: -(position * trackItemOffset) }}
        transition={effectiveTransition}
        onDragEnd={handleDragEnd}
        onAnimationStart={handleAnimationStart}
        onAnimationComplete={handleAnimationComplete}
      >
        {itemsForRender.map((item, index) => (
          <CarouselItem
            key={`${item?.id ?? index}-${index}`}
            item={item}
            index={index}
            itemWidth={itemWidth}
            round={round}
            trackItemOffset={trackItemOffset}
            x={x}
            transition={effectiveTransition}
          />
        ))}
      </motion.div>

      {/* indicators */}
      <div
        className={`flex w-full justify-center ${
          round
            ? "absolute z-20 bottom-12 left-1/2 -translate-x-1/2"
            : ""
        }`}
      >
        <div className="mt-4 flex w-[150px] justify-between px-8">
          {items.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 w-2 rounded-full cursor-pointer ${
                activeIndex === index
                  ? round
                    ? "bg-white"
                    : "bg-[#333]"
                  : round
                  ? "bg-[#555]"
                  : "bg-[rgba(51,51,51,0.4)]"
              }`}
              animate={{
                scale: activeIndex === index ? 1.2 : 1
              }}
              transition={{ duration: 0.15 }}
              onClick={() =>
                setPosition(loop ? index + 1 : index)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}