import { useEffect, useRef } from "react";

const CursorGlow = () => {
  const glowRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      // Smooth lag (easing)
      pos.current.x += (mouse.current.x - pos.current.x) * 0.08;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.08;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(
          ${pos.current.x - 200}px,
          ${pos.current.y - 200}px,
          0
        )`;
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={glowRef}
      className="
        pointer-events-none
      fixed
      top-0 left-0
      w-[400px] h-[400px]
      rounded-full
      bg-[conic-gradient(from_180deg_at_50%_50%,#8b5cf6,#ec4899,#3b82f6,#8b5cf6)]
      opacity-30
      blur-[120px]
      z-0
      "
    //   pointer-events-none
    //     fixed
    //     top-0 left-0
    //     w-[400px] h-[400px]
    //     rounded-full
    //     bg-gradient-to-r
    //     from-purple-500
    //     via-pink-500
    //     to-blue-500
    //     opacity-30
    //     blur-[120px]
    //     z-0
      
    />
  );
};

export default CursorGlow;
