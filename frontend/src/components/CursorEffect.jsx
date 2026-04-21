// import { useEffect, useRef, useCallback } from "react";

// const CursorEffect = () => {
//   const canvasRef = useRef(null);
//   const particlesRef = useRef([]);
//   const mouseRef = useRef({ x: 0, y: 0 });
//   const animationRef = useRef(0);
//   const lastSpawnRef = useRef(0);

//   const createParticle = useCallback((x, y) => {
//     const angle = Math.random() * Math.PI * 2;
//     const speed = 0.3 + Math.random() * 1.5;
//     const size = 3 + Math.random() * 10;
//     const maxLife = 35 + Math.random() * 45;

//     // Blue/indigo/violet palette matching the site's theme
//     const hueOptions = [210, 220, 230, 240, 250, 260, 270];
//     const hue = hueOptions[Math.floor(Math.random() * hueOptions.length)];

//     return {
//       x,
//       y,
//       size,
//       opacity: 0.5 + Math.random() * 0.3,
//       vx: Math.cos(angle) * speed,
//       vy: Math.sin(angle) * speed - 0.5 - Math.random() * 0.8,
//       hue,
//       life: 0,
//       maxLife,
//       scale: 0,
//     };
//   }, []);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext("2d", { alpha: true });
//     if (!ctx) return;

//     const resize = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     };
//     resize();
//     window.addEventListener("resize", resize);

//     const handleMouseMove = (e) => {
//       mouseRef.current.x = e.clientX;
//       mouseRef.current.y = e.clientY;

//       const now = Date.now();
//       if (now - lastSpawnRef.current > 35) {
//         const count = 1 + Math.floor(Math.random() * 2);
//         for (let i = 0; i < count; i++) {
//           const offsetX = (Math.random() - 0.5) * 14;
//           const offsetY = (Math.random() - 0.5) * 14;
//           particlesRef.current.push(
//             createParticle(e.clientX + offsetX, e.clientY + offsetY)
//           );
//         }
//         lastSpawnRef.current = now;
//       }

//       if (particlesRef.current.length > 50) {
//         particlesRef.current = particlesRef.current.slice(-50);
//       }
//     };

//     const handleMouseLeave = () => {
//       mouseRef.current.x = -100;
//       mouseRef.current.y = -100;
//     };

//     window.addEventListener("mousemove", handleMouseMove, { passive: true });
//     window.addEventListener("mouseleave", handleMouseLeave);

//     const animate = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       particlesRef.current = particlesRef.current.filter(
//         (p) => p.life < p.maxLife
//       );

//       for (const p of particlesRef.current) {
//         p.life++;
//         const progress = p.life / p.maxLife;

//         // Scale in
//         if (progress < 0.15) {
//           p.scale = progress / 0.15;
//         } else {
//           p.scale = 1;
//         }

//         // Fade out
//         const fadeOut = progress > 0.5 ? 1 - (progress - 0.5) / 0.5 : 1;
//         const currentOpacity = p.opacity * fadeOut * p.scale;
//         const currentSize = p.size * p.scale * (1 + progress * 0.3);

//         // Physics
//         p.vy -= 0.012;
//         p.vx *= 0.99;
//         p.vy *= 0.99;
//         p.x += p.vx;
//         p.y += p.vy;

//         ctx.save();

//         // Outer glow
//         const glow = ctx.createRadialGradient(
//           p.x, p.y, 0,
//           p.x, p.y, currentSize * 2
//         );
//         glow.addColorStop(0, `hsla(${p.hue}, 90%, 65%, ${currentOpacity * 0.12})`);
//         glow.addColorStop(1, `hsla(${p.hue}, 90%, 65%, 0)`);
//         ctx.fillStyle = glow;
//         ctx.beginPath();
//         ctx.arc(p.x, p.y, currentSize * 2, 0, Math.PI * 2);
//         ctx.fill();

//         // Main body
//         const body = ctx.createRadialGradient(
//           p.x - currentSize * 0.25,
//           p.y - currentSize * 0.25,
//           currentSize * 0.1,
//           p.x, p.y, currentSize
//         );
//         body.addColorStop(0, `hsla(${p.hue}, 85%, 75%, ${currentOpacity * 0.6})`);
//         body.addColorStop(0.5, `hsla(${p.hue}, 90%, 60%, ${currentOpacity * 0.4})`);
//         body.addColorStop(1, `hsla(${p.hue}, 85%, 55%, ${currentOpacity * 0.12})`);
//         ctx.fillStyle = body;
//         ctx.beginPath();
//         ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
//         ctx.fill();

//         // Rim
//         ctx.strokeStyle = `hsla(${p.hue}, 75%, 70%, ${currentOpacity * 0.3})`;
//         ctx.lineWidth = 0.6;
//         ctx.beginPath();
//         ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
//         ctx.stroke();

//         // Specular highlight
//         const hlSize = currentSize * 0.3;
//         const hlX = p.x - currentSize * 0.28;
//         const hlY = p.y - currentSize * 0.28;
//         const hl = ctx.createRadialGradient(hlX, hlY, 0, hlX, hlY, hlSize);
//         hl.addColorStop(0, `hsla(0, 0%, 100%, ${currentOpacity * 0.6})`);
//         hl.addColorStop(1, `hsla(0, 0%, 100%, 0)`);
//         ctx.fillStyle = hl;
//         ctx.beginPath();
//         ctx.arc(hlX, hlY, hlSize, 0, Math.PI * 2);
//         ctx.fill();

//         ctx.restore();
//       }

//       animationRef.current = requestAnimationFrame(animate);
//     };

//     animationRef.current = requestAnimationFrame(animate);

//     return () => {
//       window.removeEventListener("resize", resize);
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseleave", handleMouseLeave);
//       cancelAnimationFrame(animationRef.current);
//     };
//   }, [createParticle]);

//   return (
//     <canvas
//       ref={canvasRef}
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100%",
//         height: "100%",
//         pointerEvents: "none",
//         zIndex: 9998,
//       }}
//     />
//   );
// };

// export default CursorEffect;
