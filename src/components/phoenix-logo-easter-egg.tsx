"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useEffectEvent, useRef } from "react";

export type PhoenixFlightState = {
    id: number;
    startX: number;
    startY: number;
    size: number;
    messageIndex: number;
};

type PhoenixLogoEasterEggProps = {
    flight: PhoenixFlightState | null;
    onComplete: () => void;
};

const FLIGHT_DURATION_MS = 9200;
const FLIGHT_OFFSETS = [0, 0.11, 0.22, 0.34, 0.66, 0.8, 0.91, 1];
const PHOENIX_MESSAGES = [
    {
        kicker: "Five clicks? Fine.",
        line: "If your chimney starts doing this, call us.",
    },
    {
        kicker: "Routine maintenance matters.",
        line: "I make an entrance. Soot should not.",
    },
    {
        kicker: "This is still less dramatic.",
        line: "Than a blocked flue in January.",
    },
    {
        kicker: "Calgary, behold.",
        line: "Your WETT jump scare.",
    },
];

export function PhoenixLogoEasterEgg({
    flight,
    onComplete,
}: PhoenixLogoEasterEggProps) {
    const phoenixRef = useRef<HTMLDivElement | null>(null);
    const completeFlight = useEffectEvent(onComplete);

    useEffect(() => {
        if (!flight || !phoenixRef.current) {
            return;
        }

        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

        if (mediaQuery.matches) {
            completeFlight();
            return;
        }

        const node = phoenixRef.current;
        const size = flight.size;
        const start = {
            x: flight.startX - size / 2,
            y: flight.startY - size / 2,
        };
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const hoverPoint = {
            x: viewportWidth * 0.5 - size * 0.5,
            y: viewportHeight * 0.5 - size * 0.5,
        };
        const waypoints = [
            {
                x: start.x,
                y: start.y,
                scale: 0.72,
                rotate: -16,
                easing: "cubic-bezier(0.2, 0.9, 0.22, 1)",
            },
            {
                x: Math.min(viewportWidth * 0.22, start.x + 220),
                y: Math.max(20, start.y - viewportHeight * 0.2),
                scale: 0.96,
                rotate: -24,
                easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            },
            {
                x: viewportWidth - size - 28,
                y: Math.max(28, viewportHeight * 0.16),
                scale: 1.2,
                rotate: 24,
                easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            },
            {
                x: hoverPoint.x,
                y: hoverPoint.y,
                scale: 1.18,
                rotate: 0,
                easing: "linear",
            },
            {
                x: hoverPoint.x,
                y: hoverPoint.y,
                scale: 1.18,
                rotate: 0,
                easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            },
            {
                x: viewportWidth * 0.28,
                y: Math.min(viewportHeight - size - 52, viewportHeight * 0.72),
                scale: 0.96,
                rotate: -26,
                easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            },
            {
                x: Math.min(viewportWidth * 0.14, start.x + 96),
                y: Math.min(viewportHeight - size - 28, start.y + viewportHeight * 0.08),
                scale: 0.84,
                rotate: -14,
                easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            },
            {
                x: start.x,
                y: start.y,
                scale: 0.76,
                rotate: 0,
            },
        ];

        const flightAnimation = node.animate(
            waypoints.map((point, index) => ({
                transform: `translate3d(${point.x}px, ${point.y}px, 0) scale(${point.scale}) rotate(${point.rotate}deg)`,
                opacity: index === 0 ? 0.28 : index === waypoints.length - 1 ? 0.16 : 1,
                offset: FLIGHT_OFFSETS[index],
                easing: point.easing,
            })),
            {
                duration: FLIGHT_DURATION_MS,
                easing: "linear",
                fill: "forwards",
            },
        );

        flightAnimation.finished
            .catch(() => undefined)
            .then(() => {
                completeFlight();
            });

        return () => {
            flightAnimation.cancel();
        };
    }, [flight]);

    if (!flight) {
        return null;
    }

    const message = PHOENIX_MESSAGES[flight.messageIndex % PHOENIX_MESSAGES.length];

    return (
        <div className="phoenix-easter-egg-layer" aria-hidden="true">
            <div className="phoenix-easter-egg-sky" />
            <div
                ref={phoenixRef}
                className="phoenix-easter-egg"
                style={{
                    ["--phoenix-size" as string]: `${flight.size}px`,
                    ["--phoenix-flight-duration" as string]: `${FLIGHT_DURATION_MS}ms`,
                } as CSSProperties}
            >
                <div className="phoenix-easter-egg-aura" />
                <div className="phoenix-easter-egg-trail" />
                <div className="phoenix-easter-egg-core" />
                <div className="phoenix-easter-egg-speech-bubble">
                    <span className="phoenix-easter-egg-speech-glint" />
                    <strong>{message.kicker}</strong>
                    <span>{message.line}</span>
                </div>
                {Array.from({ length: 8 }).map((_, index) => (
                    <span
                        key={`${flight.id}-${index}`}
                        className="phoenix-easter-egg-ember"
                        style={{ ["--ember-index" as string]: String(index) } as CSSProperties}
                    />
                ))}
                <span className="phoenix-easter-egg-return-burst" />
                <Image
                    src="/images/brand/favicon-512.png"
                    alt=""
                    width={flight.size}
                    height={flight.size}
                    priority
                    draggable={false}
                    className="phoenix-easter-egg-mark"
                />
            </div>
        </div>
    );
}