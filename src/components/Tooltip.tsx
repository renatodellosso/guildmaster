import { ReactNode, useEffect, useRef, useState } from "react";

export function Tooltip({
  children,
  content,
}: {
  children: ReactNode;
  content: ReactNode;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      if (contentRef.current) {
        const tooltipWidth = contentRef.current.offsetWidth;
        const tooltipHeight = contentRef.current.offsetHeight;
        let left = event.pageX + 10;
        let top = event.pageY + 10;

        if (left + tooltipWidth > window.innerWidth) {
          left = event.pageX - tooltipWidth - 10;
        }
        if (top + tooltipHeight > window.innerHeight) {
          top = event.pageY - tooltipHeight - 10;
        }

        contentRef.current.style.left = `${left}px`;
        contentRef.current.style.top = `${top}px`;
      }
    }

    if (isHovered) {
      window.addEventListener("mousemove", handleMouseMove);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isHovered]);

  const contentWrapper = (
    <div
      ref={contentRef}
      className="text-sm absolute bg-black border px-1"
    >
      {content}
    </div>
  );

  return (
    <>
      <span
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </span>
      {isHovered && contentWrapper}
    </>
  );
}
