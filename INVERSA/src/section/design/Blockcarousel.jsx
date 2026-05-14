// Blockcarousel.jsx

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";

const DRAG_BUFFER = 20;
const VELOCITY_THRESHOLD = 500;
const GAP = 20;

const SPRING_OPTIONS = {
  type: "spring",
  stiffness: 220,
  damping: 28,
};

function CarouselItem({
  item,
  index,
  itemWidth,
  trackItemOffset,
  x,
  transition,
}) {

  const range = [
    -(index + 1) * trackItemOffset,
    -index * trackItemOffset,
    -(index - 1) * trackItemOffset,
  ];

  const rotateY = useTransform(
    x,
    range,
    [35, 0, -35],
    { clamp: false }
  );

  const Icon = item.icon;

  return (
    <motion.div
      className="
      relative shrink-0 overflow-hidden
      rounded-[2rem]

      border border-light-border dark:border-dark-border

      bg-light-background dark:bg-dark-surface

      shadow-sm dark:shadow-none

      transition-all duration-300

      hover:border-light-accent/30
      dark:hover:border-dark-accent/30

      hover:-translate-y-1

      cursor-grab active:cursor-grabbing
      "
      style={{
        width: itemWidth,
        rotateY,
      }}
      transition={transition}
    >
      <div className="flex h-full flex-col justify-between p-7">

        {/* ICON */}
        <div
          className="
          flex h-12 w-12 items-center justify-center
          rounded-2xl

          bg-light-surface dark:bg-dark-background

          text-light-accent dark:text-dark-accent

          border border-light-border dark:border-dark-border
          "
        >
          {Icon && <Icon className="h-5 w-5" />}
        </div>

        {/* CONTENT */}
        <div className="mt-10">

          <h3
            className="
            text-lg font-semibold tracking-tight

            text-light-primary dark:text-dark-primary
            "
          >
            {item.title}
          </h3>

          <p
            className="
            mt-3 text-sm leading-relaxed

            text-light-secondary dark:text-dark-secondary
            "
          >
            {item.description}
          </p>

        </div>
      </div>
    </motion.div>
  );
}

export default function Blockcarousel({
  items = [],
  baseWidth = 460,
  mobileBaseWidth = 340,
  autoplay = false,
  autoplayDelay = 3500,
  pauseOnHover = false,
  loop = false,
}) {

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };

  }, []);

  const effectiveBaseWidth =
    isMobile
      ? mobileBaseWidth
      : baseWidth;

  const containerPadding = 16;

  const itemWidth =
    effectiveBaseWidth - containerPadding * 2;

  const trackItemOffset = itemWidth + GAP;

  const itemsForRender = useMemo(() => {

    if (!loop) return items;

    if (items.length === 0) return [];

    return [
      items[items.length - 1],
      ...items,
      items[0],
    ];

  }, [items, loop]);

  const [position, setPosition] =
    useState(loop ? 1 : 0);

  const x = useMotionValue(0);

  const [isHovered, setIsHovered] =
    useState(false);

  const [isAnimating, setIsAnimating] =
    useState(false);

  const [isJumping, setIsJumping] =
    useState(false);

  const containerRef = useRef(null);

  useEffect(() => {

    if (!pauseOnHover || !containerRef.current)
      return;

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

  useEffect(() => {

    if (!autoplay) return;

    if (itemsForRender.length <= 1) return;

    if (pauseOnHover && isHovered) return;

    const timer = setInterval(() => {

      if (!isAnimating) {

        setPosition((prev) =>
          Math.min(
            prev + 1,
            itemsForRender.length - 1
          )
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
    isAnimating,
  ]);

  useEffect(() => {

    const start = loop ? 1 : 0;

    setPosition(start);

    x.set(-start * trackItemOffset);

  }, []);

  const effectiveTransition =
    isJumping
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

    const lastCloneIndex =
      itemsForRender.length - 1;

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
      offset.x < -DRAG_BUFFER ||
      velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER ||
          velocity.x > VELOCITY_THRESHOLD
        ? -1
        : 0;

    if (direction === 0) return;

    setPosition((prev) => {

      const next = prev + direction;

      const max =
        itemsForRender.length - 1;

      return Math.max(
        0,
        Math.min(next, max)
      );

    });

  };

  const activeIndex =
    items.length === 0
      ? 0
      : loop
      ? (
          position -
          1 +
          items.length
        ) % items.length
      : Math.min(
          position,
          items.length - 1
        );

  return (
    <div
      ref={containerRef}
      className="
      relative overflow-hidden

      rounded-[2rem]

      border border-light-border
      dark:border-dark-border

      bg-light-surface
      dark:bg-dark-background

      p-4
      "
      style={{
        width: `${effectiveBaseWidth}px`,
      }}
    >
      <motion.div
        className="flex"
        drag={isAnimating ? false : "x"}
        style={{
          gap: `${GAP}px`,
          perspective: 1000,
          perspectiveOrigin: `${
            position * trackItemOffset +
            itemWidth / 2
          }px 50%`,
          x,
        }}
        animate={{
          x: -(position * trackItemOffset),
        }}
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
            trackItemOffset={trackItemOffset}
            x={x}
            transition={effectiveTransition}
          />

        ))}
      </motion.div>

      {/* INDICATOR */}
      <div className="mt-6 flex justify-center">

        <div className="flex gap-2">

          {items.map((_, index) => (

            <motion.button
              key={index}
              className={`
                h-2 rounded-full transition-all

                ${
                  activeIndex === index
                    ? "w-6 bg-light-accent dark:bg-dark-accent"
                    : "w-2 bg-light-secondary dark:bg-dark-border"
                }
              `}
              animate={{
                scale:
                  activeIndex === index
                    ? 1.15
                    : 1,
              }}
              transition={{
                duration: 0.15,
              }}
              onClick={() =>
                setPosition(
                  loop
                    ? index + 1
                    : index
                )
              }
            />

          ))}

        </div>

      </div>
    </div>
  );
}