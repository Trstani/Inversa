import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";

const DRAG_BUFFER = 20;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 };

function CarouselItem({ item, index, itemWidth, round, trackItemOffset, x, transition }) {
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
          ? "items-center justify-center text-center bg-gradient-to-br from-purple-600 to-indigo-600"
          : "items-start justify-between bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow"
      } overflow-hidden cursor-grab active:cursor-grabbing`}
      style={{
        width: itemWidth,
        height: round ? itemWidth : "100%",
        rotateY,
        ...(round && { borderRadius: "50%" })
      }}
      transition={transition}
    >
      <div className={`${round ? "p-0 m-0" : "mb-4 p-6"}`}>
        <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${
          round ? "bg-white/20" : "bg-purple-600/20"
        } text-white`}>
          {Icon && <Icon className="w-6 h-6" />}
        </span>
      </div>

      <div className="p-6 pt-0">
        <div className="mb-2 font-bold text-xl text-white">{item.title}</div>
        <p className="text-sm text-gray-200">{item.description}</p>
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

  // Pause autoplay saat hover
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

  // Autoplay
  useEffect(() => {
    if (!autoplay) return;
    if (itemsForRender.length <= 1) return;
    if (pauseOnHover && isHovered) return;

    const timer = setInterval(() => {
      if (!isAnimating) {
        setPosition((prev) => Math.min(prev + 1, itemsForRender.length - 1));
      }
    }, autoplayDelay);

    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, isHovered, pauseOnHover, itemsForRender.length, isAnimating]);

  // Posisi awal
  useEffect(() => {
    const start = loop ? 1 : 0;
    setPosition(start);
    x.set(-start * trackItemOffset);
  }, []);

  // Keamanan non-loop
  useEffect(() => {
    if (!loop && position > itemsForRender.length - 1) {
      setPosition(itemsForRender.length - 1);
    }
  }, [position, itemsForRender.length, loop]);

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
          left: -trackItemOffset * Math.max(itemsForRender.length - 1, 0),
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
          ? "rounded-full border border-white/20"
          : "rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm"
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
          perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`,
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

      {/* Indikator */}
      <div
        className={`flex w-full justify-center ${
          round ? "absolute z-20 bottom-12 left-1/2 -translate-x-1/2" : "mt-6"
        }`}
      >
        <div className="flex gap-2">
          {items.map((_, index) => (
            <motion.button
              key={index}
              className={`h-2 rounded-full cursor-pointer transition-all ${
                activeIndex === index ? "w-6 bg-purple-400" : "w-2 bg-white/30 hover:bg-white/50"
              }`}
              animate={{ scale: activeIndex === index ? 1.2 : 1 }}
              transition={{ duration: 0.15 }}
              onClick={() => setPosition(loop ? index + 1 : index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}