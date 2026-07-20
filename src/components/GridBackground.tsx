
import React, { useEffect, useRef } from 'react';

interface GridNode {
    x: number;
    y: number;
    opacity: number;
    pulsePhase: number;
    pulseSpeed: number;
}

interface GridEdge {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    progress: number;
    drawSpeed: number;
    maxOpacity: number;
    opacity: number;
    life: number;
    state: 'drawing' | 'visible' | 'fading';
}

export function GridBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        let nodes: GridNode[] = [];
        let edges: GridEdge[] = [];
        let animationFrameId: number;
        let time = 0;
        let driftX = 0;
        let driftY = 0;

        const GRID = 48;

        const clusterWeight = (col: number, row: number, cols: number, rows: number) => {
            const cx = cols * 0.62;
            const cy = rows * 0.48;
            const dx = (col - cx) / cols;
            const dy = (row - cy) / rows;
            const dist = Math.sqrt(dx * dx + dy * dy);
            return Math.max(0.04, 0.55 - dist * 1.1);
        };

        const createEdge = (
            x1: number,
            y1: number,
            x2: number,
            y2: number,
            maxOpacity: number
        ): GridEdge => ({
            x1,
            y1,
            x2,
            y2,
            progress: 0,
            drawSpeed: 0.02 + Math.random() * 0.028,
            maxOpacity,
            opacity: 0,
            life: 120 + Math.random() * 160,
            state: 'drawing',
        });

        const buildNetwork = () => {
            const cols = Math.ceil(width / GRID) + 2;
            const rows = Math.ceil(height / GRID) + 2;
            const nodeMap = new Map<string, GridNode>();
            const newNodes: GridNode[] = [];
            const newEdges: GridEdge[] = [];

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    if (Math.random() > clusterWeight(col, row, cols, rows)) continue;

                    const node: GridNode = {
                        x: col * GRID,
                        y: row * GRID,
                        opacity: 0.35 + Math.random() * 0.45,
                        pulsePhase: Math.random() * Math.PI * 2,
                        pulseSpeed: 0.014 + Math.random() * 0.018,
                    };
                    nodeMap.set(`${col},${row}`, node);
                    newNodes.push(node);
                }
            }

            const tryAddEdge = (x1: number, y1: number, x2: number, y2: number) => {
                if (x1 === x2 && y1 === y2) return;
                const maxOpacity = 0.15 + Math.random() * 0.35;
                newEdges.push(createEdge(x1, y1, x2, y2, maxOpacity));
            };

            for (const node of newNodes) {
                const col = Math.round(node.x / GRID);
                const row = Math.round(node.y / GRID);

                if (Math.random() < 0.55) {
                    const span = 1 + Math.floor(Math.random() * 3);
                    const dir = Math.random() < 0.5 ? 1 : -1;
                    const neighbor = nodeMap.get(`${col + span * dir},${row}`);
                    if (neighbor) {
                        tryAddEdge(node.x, node.y, neighbor.x, neighbor.y);
                    } else if (Math.random() < 0.4) {
                        tryAddEdge(node.x, node.y, node.x + span * dir * GRID, node.y);
                    }
                }

                if (Math.random() < 0.45) {
                    const span = 1 + Math.floor(Math.random() * 3);
                    const dir = Math.random() < 0.5 ? 1 : -1;
                    const neighbor = nodeMap.get(`${col},${row + span * dir}`);
                    if (neighbor) {
                        tryAddEdge(node.x, node.y, neighbor.x, neighbor.y);
                    } else if (Math.random() < 0.4) {
                        tryAddEdge(node.x, node.y, node.x, node.y + span * dir * GRID);
                    }
                }
            }

            const orphanCount = Math.floor((width * height) / 28000);
            for (let i = 0; i < orphanCount; i++) {
                const col = Math.floor(Math.random() * cols);
                const row = Math.floor(Math.random() * rows);
                if (Math.random() > clusterWeight(col, row, cols, rows) * 1.4) continue;

                const x = col * GRID;
                const y = row * GRID;
                const horizontal = Math.random() < 0.5;
                const span = (1 + Math.floor(Math.random() * 2)) * GRID;
                const dir = Math.random() < 0.5 ? 1 : -1;

                if (horizontal) {
                    tryAddEdge(x, y, x + span * dir, y);
                } else {
                    tryAddEdge(x, y, x, y + span * dir);
                }
            }

            nodes = newNodes;
            edges = newEdges;
        };

        const spawnEdge = () => {
            if (nodes.length === 0) return;

            const origin = nodes[Math.floor(Math.random() * nodes.length)];
            const horizontal = Math.random() < 0.5;
            const span = (1 + Math.floor(Math.random() * 3)) * GRID;
            const dir = Math.random() < 0.5 ? 1 : -1;

            const x2 = horizontal ? origin.x + span * dir : origin.x;
            const y2 = horizontal ? origin.y : origin.y + span * dir;

            edges.push(createEdge(origin.x, origin.y, x2, y2, 0.2 + Math.random() * 0.3));

            if (edges.length > 220) {
                edges.shift();
            }
        };

        const init = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            buildNetwork();
        };

        const draw = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            const isDark = document.documentElement.classList.contains('dark');
            const baseRgb = isDark ? '255, 255, 255' : '10, 10, 10';

            time += 1;
            driftX = Math.sin(time * 0.002) * 7;
            driftY = Math.cos(time * 0.0015) * 5;

            ctx.save();
            ctx.translate(driftX, driftY);

            edges.forEach((edge) => {
                if (edge.state === 'drawing') {
                    edge.progress = Math.min(1, edge.progress + edge.drawSpeed);
                    edge.opacity = edge.maxOpacity * edge.progress;
                    if (edge.progress >= 1) edge.state = 'visible';
                } else if (edge.state === 'visible') {
                    edge.life -= 1;
                    edge.opacity = edge.maxOpacity;
                    if (edge.life <= 0) edge.state = 'fading';
                } else {
                    edge.opacity = Math.max(0, edge.opacity - 0.02);
                }

                if (edge.opacity <= 0) return;

                const dx = edge.x2 - edge.x1;
                const dy = edge.y2 - edge.y1;
                const len = Math.sqrt(dx * dx + dy * dy);
                if (len === 0) return;

                const drawLen = len * Math.min(edge.progress, 1);

                ctx.beginPath();
                ctx.moveTo(edge.x1, edge.y1);
                ctx.lineTo(
                    edge.x1 + (dx / len) * drawLen,
                    edge.y1 + (dy / len) * drawLen
                );
                ctx.strokeStyle = `rgba(${baseRgb}, ${edge.opacity})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            });

            edges = edges.filter((edge) => edge.state !== 'fading' || edge.opacity > 0);

            nodes.forEach((node) => {
                const pulse = Math.sin(time * node.pulseSpeed + node.pulsePhase) * 0.2 + 0.8;
                const opacity = node.opacity * pulse;

                ctx.beginPath();
                ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${baseRgb}, ${opacity})`;
                ctx.fill();
            });

            ctx.restore();

            if (time % 50 === 0) spawnEdge();

            animationFrameId = requestAnimationFrame(draw);
        };

        init();
        draw();

        const handleResize = () => init();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[-1] pointer-events-none bg-background transition-colors duration-300"
        />
    );
}
