import React, { useEffect, useRef, useState } from "react";

interface ScaleWrapperProps {
    children: React.ReactNode;
    designWidth: number;
    designHeight: number;
    maintainAspectRatio?: boolean;
}

export const ScaleWrapper: React.FC<ScaleWrapperProps> = ({
    children,
    designWidth,
    designHeight,
    maintainAspectRatio = true,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const parent = containerRef.current.parentElement;
                if (parent) {
                    const { clientWidth: parentWidth, clientHeight: parentHeight } = parent;

                    const scaleX = parentWidth / designWidth;
                    const scaleY = parentHeight / designHeight;

                    const newScale = maintainAspectRatio
                        ? Math.min(scaleX, scaleY)
                        : Math.min(scaleX, scaleY);

                    setScale(newScale);

                    const scaledWidth = designWidth * newScale;
                    const scaledHeight = designHeight * newScale;

                    const x = (parentWidth - scaledWidth) / 2;
                    const y = (parentHeight - scaledHeight) / 2;

                    setPosition({ x, y });
                }
            }
        };

        updateScale();

        const parent = containerRef.current?.parentElement;
        if (!parent) return;

        const observer = new ResizeObserver(updateScale);
        observer.observe(parent);
        window.addEventListener("resize", updateScale);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updateScale);
        };
    }, [designWidth, designHeight, maintainAspectRatio]);

    return (
        <div
            ref={containerRef}
            style={{
                width: designWidth,
                height: designHeight,
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: "top left",
                position: "absolute",
                top: 0,
                left: 0,
            }}
        >
            {children}
        </div>
    );
};
