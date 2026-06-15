import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { photos } from "@/lib/maylu-photos";

const ENEMIES_DATA = [
  { type: "paloma", w: 48, h: 48, pts: 15, speed: 0.35, color: "#C4B5FD", img: photos.paloma },
  { type: "gato", w: 52, h: 52, pts: 20, speed: 0.30, color: "#FCA5A5", img: photos.gato },
];

const VIRINGO_FACTS = [
  "El viringo peruano existe hace más de 3000 años — es una de las razas más antiguas de América.",
  "Los Incas lo consideraban un perro sagrado y aparece en cerámicas Moche y Chimú.",
  "Su piel es cálida al tacto: lo llamaban 'perro calientito' y lo usaban como compresa natural.",
  "Sin pelo, casi no produce alergias — ideal para personas sensibles.",
  "En 2001 fue declarado Patrimonio Cultural de la Nación en el Perú.",
  "Su nombre en quechua es 'Allqu'; 'viringo' viene de la costa norte peruana.",
  "Pueden vivir entre 12 y 14 años, y son extremadamente leales a su familia.",
  "Existen tres tamaños oficiales: pequeño, mediano y grande.",
  "Aunque parece frágil, es ágil, atlético y excelente cazador de roedores.",
  "Su temperatura corporal es ligeramente más alta que la de otros perros: ~40 °C.",
  "Muchos viringos nacen con pocos dientes — es una característica genética de la raza.",
  "Por ley peruana, todo sitio arqueológico de la costa debería tener un viringo como guardián.",
];

const STARS = Array.from({ length: 120 }, () => ({
  x: Math.random(),
  y: Math.random(),
  r: 0.5 + Math.random() * 1.5,
  a: 0.4 + Math.random() * 0.6,
  twinkle: Math.random() * Math.PI * 2,
}));

const IMG_SIZE = 52;

function randomFact(prev?: string): string {
  let f = VIRINGO_FACTS[Math.floor(Math.random() * VIRINGO_FACTS.length)];
  if (prev && VIRINGO_FACTS.length > 1) {
    while (f === prev) f = VIRINGO_FACTS[Math.floor(Math.random() * VIRINGO_FACTS.length)];
  }
  return f;
}

const C = {
  cream: "#FFF8E7",
  butter: "#FFD93D",
  honey: "#F5C518",
  cocoa: "#5C3A1E",
  blush: "#FFB6B6",
};

function drawSpaceBackground(ctx: CanvasRenderingContext2D, W: number, H: number, frame: number) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#05071a");
  grad.addColorStop(0.5, "#0d0f2e");
  grad.addColorStop(1, "#0a0718");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  const nGrad1 = ctx.createRadialGradient(W * 0.2, H * 0.3, 0, W * 0.2, H * 0.3, W * 0.35);
  nGrad1.addColorStop(0, "rgba(100,40,180,0.08)");
  nGrad1.addColorStop(1, "transparent");
  ctx.fillStyle = nGrad1;
  ctx.fillRect(0, 0, W, H);

  const nGrad2 = ctx.createRadialGradient(W * 0.8, H * 0.6, 0, W * 0.8, H * 0.6, W * 0.3);
  nGrad2.addColorStop(0, "rgba(30,80,180,0.07)");
  nGrad2.addColorStop(1, "transparent");
  ctx.fillStyle = nGrad2;
  ctx.fillRect(0, 0, W, H);

  STARS.forEach((s) => {
    const alpha = s.a * (0.7 + 0.3 * Math.sin(frame * 0.03 + s.twinkle));
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  const pGrad = ctx.createRadialGradient(W * 0.08, H * 0.88, 0, W * 0.08, H * 0.88, W * 0.09);
  pGrad.addColorStop(0, "#4338ca");
  pGrad.addColorStop(0.6, "#312e81");
  pGrad.addColorStop(1, "#1e1b4b");
  ctx.fillStyle = pGrad;
  ctx.beginPath();
  ctx.arc(W * 0.08, H * 0.92, W * 0.085, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(W * 0.08, H * 0.92);
  ctx.rotate(-0.3);
  ctx.strokeStyle = "rgba(167,139,250,0.5)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 0, W * 0.13, W * 0.03, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  const p2Grad = ctx.createRadialGradient(W * 0.92, H * 0.08, 0, W * 0.92, H * 0.08, W * 0.045);
  p2Grad.addColorStop(0, "#be185d");
  p2Grad.addColorStop(1, "#500724");
  ctx.fillStyle = p2Grad;
  ctx.beginPath();
  ctx.arc(W * 0.92, H * 0.08, W * 0.04, 0, Math.PI * 2);
  ctx.fill();
}

const DOG_W = 72;
const DOG_H = 56;

function drawDog(ctx: CanvasRenderingContext2D, x: number, y: number, img: HTMLImageElement, scale = 1) {
  const w = DOG_W * scale;
  const h = DOG_H * scale;
  ctx.drawImage(img, x - w / 2, y - h / 2, w, h);
}

function drawBullet(ctx: CanvasRenderingContext2D, b: { x: number; y: number }) {
  ctx.save();
  ctx.shadowColor = "#a78bfa";
  ctx.shadowBlur = 8;
  ctx.fillStyle = "#c4b5fd";
  ctx.beginPath();
  ctx.ellipse(b.x, b.y, 3, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.ellipse(b.x, b.y, 1.5, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPowerUp(ctx: CanvasRenderingContext2D, p: PowerUp) {
  ctx.save();
  const pulse = 1 + 0.08 * Math.sin(Date.now() * 0.006);
  const r = (p.w / 2) * pulse;

  if (p.type === "life") {
    ctx.shadowColor = "#ff69b4";
    ctx.shadowBlur = 18;
    ctx.fillStyle = "#ff4d85";
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#fff";
    ctx.font = `bold ${r * 1.1}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("♥", p.x, p.y + 1);
  } else {
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 18;
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#fff";
    ctx.font = `bold ${r}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("⚡", p.x, p.y + 1);
  }
  ctx.restore();
}

function drawLaserBeam(ctx: CanvasRenderingContext2D, dogX: number, dogY: number) {
  ctx.save();
  const grad = ctx.createLinearGradient(dogX - 5, 0, dogX + 5, 0);
  grad.addColorStop(0, "rgba(251,191,36,0)");
  grad.addColorStop(0.25, "rgba(251,191,36,0.6)");
  grad.addColorStop(0.4, "rgba(255,255,255,1)");
  grad.addColorStop(0.6, "rgba(255,255,255,1)");
  grad.addColorStop(0.75, "rgba(251,191,36,0.6)");
  grad.addColorStop(1, "rgba(251,191,36,0)");

  ctx.shadowColor = "#fbbf24";
  ctx.shadowBlur = 30;
  ctx.fillStyle = grad;
  ctx.fillRect(dogX - 5, 0, 10, dogY - 22);

  ctx.shadowBlur = 0;
  ctx.restore();
}

type EnemyData = {
  type: string; w: number; h: number; pts: number;
  speed: number; color: string; img: string;
};

type Enemy = EnemyData & {
  x: number; y: number; vy: number; vx: number;
  active: boolean; tick: number;
};

type Bullet = { x: number; y: number; vy: number; active: boolean };

type Particle = {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; color: string; r: number;
};

type FloatText = { text: string; x: number; y: number; life: number; maxLife: number };

type PowerUp = {
  x: number; y: number; w: number; h: number;
  type: "life" | "laser";
  vy: number; active: boolean;
};

type GameState = {
  W: number; H: number;
  dog: { x: number; y: number; w: number; h: number };
  targetX: number;
  bullets: Bullet[];
  enemies: Enemy[];
  particles: Particle[];
  floatTexts: FloatText[];
  powerUps: PowerUp[];
  laserTimer: number;
  score: number; lives: number; level: number;
  frameCount: number; lastShot: number;
};

export default function MayluDefender() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const rafRef = useRef<number>(0);
  const imgCacheRef = useRef<Record<string, HTMLImageElement>>({});
  const keysRef = useRef(new Set<string>());

  const [gamePhase, setGamePhase] = useState<"start" | "playing" | "gameover">("start");
  const [hud, setHud] = useState({ score: 0, lives: 3, level: 1 });
  const [finalScore, setFinalScore] = useState(0);
  const [finalLevel, setFinalLevel] = useState(1);
  const [fact, setFact] = useState<string>(() => randomFact());

  const dogImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const cache: Record<string, HTMLImageElement> = {};
    for (const e of ENEMIES_DATA) {
      const img = new Image();
      img.src = e.img;
      img.crossOrigin = "anonymous";
      cache[e.type] = img;
    }
    imgCacheRef.current = cache;

    const dogImg = new Image();
    dogImg.src = photos.maylugame;
    dogImg.crossOrigin = "anonymous";
    dogImgRef.current = dogImg;
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const w = wrapper.clientWidth;
    const h = Math.round(w * (540 / 720));
    canvas.width = w;
    canvas.height = h;
    if (stateRef.current) {
      stateRef.current.W = w;
      stateRef.current.H = h;
      stateRef.current.dog.y = h - 28;
      stateRef.current.dog.x = Math.min(stateRef.current.dog.x, w - 30);
    }
  }, []);

  useEffect(() => {
    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, [resizeCanvas]);

  const initState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width;
    const H = canvas.height;
    stateRef.current = {
      W, H,
      dog: { x: W / 2, y: H - 28, w: DOG_W, h: DOG_H },
      targetX: W / 2,
      bullets: [],
      enemies: [],
      particles: [],
      floatTexts: [],
      powerUps: [],
      laserTimer: 0,
      score: 0,
      lives: 3,
      level: 1,
      frameCount: 0,
      lastShot: 0,
    };
  }, []);

  const shoot = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    const now = Date.now();
    if (now - s.lastShot < 160) return;
    s.lastShot = now;
    s.bullets.push({ x: s.dog.x, y: s.dog.y - 20, vy: -13, active: true });
  }, []);

  const startGame = useCallback(() => {
    initState();
    setHud({ score: 0, lives: 3, level: 1 });
    setGamePhase("playing");
  }, [initState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const toCanvasX = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      return (clientX - rect.left) * scaleX;
    };

    const onMove = (e: MouseEvent) => {
      if (!stateRef.current) return;
      stateRef.current.targetX = toCanvasX(e.clientX);
    };

    const onTouch = (e: TouchEvent) => {
      if (!stateRef.current) return;
      e.preventDefault();
      stateRef.current.targetX = toCanvasX(e.touches[0].clientX);
    };

    const onTouchEnd = () => {
      if (gamePhase === "playing") shoot();
    };

    const onClick = () => {
      if (gamePhase === "playing") shoot();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (gamePhase === "playing") shoot();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchmove", onTouch, { passive: false });
    canvas.addEventListener("touchstart", onTouch, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);
    canvas.addEventListener("click", onClick);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("touchmove", onTouch);
      canvas.removeEventListener("touchstart", onTouch);
      canvas.removeEventListener("touchend", onTouchEnd);
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [gamePhase, shoot]);

  useEffect(() => {
    if (gamePhase !== "playing") {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const spawnEnemy = (s: GameState) => {
      const rate = Math.max(70 - s.level * 2, 40);
      if (s.frameCount % rate !== 0) return;
      const count = 1 + Math.floor((s.level - 1) / 3);
      for (let i = 0; i < count; i++) {
        const d = ENEMIES_DATA[Math.floor(Math.random() * ENEMIES_DATA.length)];
        const x = d.w / 2 + Math.random() * (s.W - d.w);
        const wobble = (Math.random() - 0.5) * 0.6;
        const speedMult = 1 + (s.level - 1) * 0.06;
        s.enemies.push({
          ...d, x, y: -d.h - i * 30,
          vy: d.speed * speedMult,
          vx: wobble,
          active: true,
          tick: 0,
        });
      }
    };

    const spawnPowerUp = (s: GameState) => {
      const hasActive = s.powerUps.some((p) => p.active);
      if (hasActive) return;
      if (s.frameCount < 300) return;
      if (s.frameCount % 420 !== 0) return;
      if (Math.random() > 0.6) return;
      const type: "life" | "laser" = Math.random() < 0.4 ? "life" : "laser";
      const x = 18 + Math.random() * (s.W - 36);
      s.powerUps.push({ x, y: -16, w: 32, h: 32, type, vy: 0.7, active: true });
    };

    const spawnParticle = (s: GameState, x: number, y: number, color: string) => {
      for (let i = 0; i < 12; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 1.5 + Math.random() * 3;
        s.particles.push({
          x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
          life: 40, maxLife: 40, color, r: 2 + Math.random() * 3,
        });
      }
    };

    const onGameOver = () => {
      const s = stateRef.current!;
      setFinalScore(s.score);
      setFinalLevel(s.level);
      setFact((prev) => randomFact(prev));
      setGamePhase("gameover");
    };

    const loop = () => {
      const s = stateRef.current;
      if (!s) return;

      s.frameCount++;
      ctx.clearRect(0, 0, s.W, s.H);
      drawSpaceBackground(ctx, s.W, s.H, s.frameCount);

      const keys = keysRef.current;
      if (keys.has("ArrowLeft") || keys.has("a") || keys.has("A")) {
        s.targetX = s.dog.x - 18;
      } else if (keys.has("ArrowRight") || keys.has("d") || keys.has("D")) {
        s.targetX = s.dog.x + 18;
      }
      s.dog.x += (s.targetX - s.dog.x) * 0.13;
      s.dog.x = Math.max(s.dog.w / 2, Math.min(s.W - s.dog.w / 2, s.dog.x));
      const dogScale = s.W < 400 ? 0.75 : 1;
      const dogImg = dogImgRef.current;
      if (dogImg) drawDog(ctx, s.dog.x, s.dog.y, dogImg, dogScale);

      spawnEnemy(s);
      spawnPowerUp(s);

      s.bullets = s.bullets.filter((b) => b.active && b.y > -20);
      s.bullets.forEach((b) => { b.y += b.vy; drawBullet(ctx, b); });

      s.enemies = s.enemies.filter((e) => e.active);
      s.enemies.forEach((e) => {
        e.y += e.vy;
        e.x += e.vx;
        e.tick++;
        if (e.x < e.w / 2 || e.x > s.W - e.w / 2) e.vx *= -1;

        const img = imgCacheRef.current[e.type];
        if (img) ctx.drawImage(img, e.x - IMG_SIZE / 2, e.y - IMG_SIZE / 2, IMG_SIZE, IMG_SIZE);
      });

      s.powerUps = s.powerUps.filter((p) => p.active);
      s.powerUps.forEach((p) => {
        p.y += p.vy;
        drawPowerUp(ctx, p);
        if (p.y > s.H + p.h) p.active = false;
      });

      if (s.laserTimer > 0) {
        drawLaserBeam(ctx, s.dog.x, s.dog.y);
        const pct = s.laserTimer / 3000;
        ctx.save();
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillRect(10, 10, 120, 12);
        ctx.fillStyle = "#fbbf24";
        ctx.shadowColor = "#fbbf24";
        ctx.shadowBlur = 8;
        ctx.fillRect(12, 12, 116 * pct, 8);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#fff";
        ctx.font = "bold 8px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("⚡ LÁSER", 70, 20);
        ctx.restore();
      }

      s.particles = s.particles.filter((p) => p.life > 0);
      s.particles.forEach((p) => {
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (p.life / p.maxLife), 0, Math.PI * 2);
        ctx.fill();
        p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life--;
      });
      ctx.globalAlpha = 1;

      s.floatTexts = s.floatTexts.filter((t) => t.life > 0);
      s.floatTexts.forEach((t) => {
        ctx.globalAlpha = t.life / t.maxLife;
        ctx.font = "bold 14px sans-serif";
        ctx.fillStyle = "#fde68a";
        ctx.textAlign = "center";
        ctx.shadowColor = "#f59e0b";
        ctx.shadowBlur = 6;
        ctx.fillText(t.text, t.x, t.y - (t.maxLife - t.life) * 0.9);
        ctx.shadowBlur = 0;
        t.life--;
      });
      ctx.globalAlpha = 1;

      for (const b of s.bullets) {
        if (!b.active) continue;
        const bHalfW = 6;
        const bHalfH = 14;
        for (const e of s.enemies) {
          if (!e.active) continue;
          if (
            b.x + bHalfW > e.x - IMG_SIZE / 2 &&
            b.x - bHalfW < e.x + IMG_SIZE / 2 &&
            b.y + bHalfH > e.y - IMG_SIZE / 2 &&
            b.y - bHalfH < e.y + IMG_SIZE / 2
          ) {
            b.active = false;
            e.active = false;
            s.score += e.pts;
            spawnParticle(s, e.x, e.y, e.color);
            s.floatTexts.push({ text: "+" + e.pts, x: e.x, y: e.y, life: 50, maxLife: 50 });
            s.level = Math.floor(s.score / 250) + 1;
            setHud({ score: s.score, lives: s.lives, level: s.level });
            break;
          }
        }
      }

      if (s.laserTimer > 0) {
        s.laserTimer = Math.max(0, s.laserTimer - 16.67);
        for (const e of s.enemies) {
          if (!e.active) continue;
          if (
            e.x + IMG_SIZE / 2 > s.dog.x - 8 &&
            e.x - IMG_SIZE / 2 < s.dog.x + 8 &&
            e.y + IMG_SIZE / 2 > 0 &&
            e.y - IMG_SIZE / 2 < s.dog.y - 22
          ) {
            e.active = false;
            s.score += e.pts;
            spawnParticle(s, e.x, e.y, e.color);
            s.floatTexts.push({ text: "+" + e.pts, x: e.x, y: e.y, life: 50, maxLife: 50 });
            s.level = Math.floor(s.score / 250) + 1;
            setHud({ score: s.score, lives: s.lives, level: s.level });
          }
        }
      }

      for (const e of s.enemies) {
        if (!e.active) continue;
        if (e.y > s.H + e.h) {
          e.active = false;
          s.lives--;
          spawnParticle(s, e.x, s.H - 30, "#EF4444");
          if (s.lives <= 0) { onGameOver(); return; }
          setHud({ score: s.score, lives: s.lives, level: s.level });
          continue;
        }
        const dogHalfW = s.dog.w / 2 - 6;
        const dogHalfH = s.dog.h / 2 - 4;
        if (
          e.x + IMG_SIZE / 2 - 4 > s.dog.x - dogHalfW &&
          e.x - IMG_SIZE / 2 + 4 < s.dog.x + dogHalfW &&
          e.y + IMG_SIZE / 2 - 4 > s.dog.y - dogHalfH &&
          e.y - IMG_SIZE / 2 + 4 < s.dog.y + dogHalfH
        ) {
          e.active = false;
          s.lives--;
          spawnParticle(s, e.x, e.y, "#EF4444");
          if (s.lives <= 0) { onGameOver(); return; }
          setHud({ score: s.score, lives: s.lives, level: s.level });
        }
      }

      for (const p of s.powerUps) {
        if (!p.active) continue;
        const dhw = s.dog.w / 2;
        const dhh = s.dog.h / 2;
        if (
          p.x > s.dog.x - dhw &&
          p.x < s.dog.x + dhw &&
          p.y > s.dog.y - dhh &&
          p.y < s.dog.y + dhh
        ) {
          p.active = false;
          if (p.type === "life") {
            s.lives = Math.min(s.lives + 1, 9);
            s.floatTexts.push({ text: "+1 ❤️", x: s.dog.x, y: s.dog.y - 40, life: 60, maxLife: 60 });
          } else {
            s.laserTimer = 3000;
            s.floatTexts.push({ text: "⚡ LÁSER!", x: s.dog.x, y: s.dog.y - 40, life: 60, maxLife: 60 });
          }
          setHud({ score: s.score, lives: s.lives, level: s.level });
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [gamePhase]);

  return (
    <div
      style={{
        fontFamily: "'Fredoka', 'Quicksand', sans-serif",
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
        userSelect: "none",
        background: C.cream,
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 8px 40px rgba(92,58,30,0.2)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 18px",
          background: "rgba(255,217,61,0.15)",
          borderBottom: "1px solid rgba(92,58,30,0.12)",
        }}
      >
        <span style={{ color: C.cocoa, fontSize: 14, fontWeight: 600 }}>
          🐾 {hud.score} pts
        </span>
        <span style={{ fontSize: 18 }}>{"❤️".repeat(Math.max(0, hud.lives))}</span>
        <span style={{ color: C.cocoa, fontSize: 14, fontWeight: 600 }}>
          Nivel {hud.level}
        </span>
      </div>

      <div ref={wrapperRef} style={{ position: "relative", width: "100%", cursor: "none" }}>
        <canvas ref={canvasRef} style={{ display: "block", width: "100%" }} />

        {gamePhase === "start" && (
          <div style={overlayStart}>
            <p style={{ fontSize: 56, margin: 0, lineHeight: 1 }}>🐕</p>
            <h2 style={{ color: C.cream, fontSize: 26, fontWeight: 700, margin: "12px 0 6px", letterSpacing: 1 }}>
              MAYLU SPACE DEFENDER
            </h2>
            <p style={{ color: C.butter, fontSize: 14, margin: "0 0 24px", textAlign: "center" }}>
              Mueve el ratón · Toca para disparar · Espacio/Enter
            </p>
            <button onClick={startGame} style={btnStyle}>
              ¡Despegar! 🚀
            </button>
          </div>
        )}

        {gamePhase === "gameover" && (
          <div className="absolute inset-0 flex items-center justify-center bg-cocoa/88 backdrop-blur-[2px] px-4">
            <div className="w-full max-w-md text-center text-cream">
              <p className="text-3xl mb-1">💥</p>
              <h3 className="font-display text-2xl font-bold">¡Game Over!</h3>
              <div className="flex justify-center gap-6 mt-1 text-sm">
                <span>
                  Puntaje: <strong>{finalScore}</strong>
                </span>
                <span>
                  Nivel: <strong>{finalLevel}</strong>
                </span>
              </div>
              <div className="mt-3 rounded-xl border border-butter/40 bg-white/10 p-3 text-left">
                <p className="text-[11px] font-bold uppercase tracking-wider text-butter mb-1">
                  ¿Sabías que? · Viringo peruano
                </p>
                <p className="text-sm leading-snug">{fact}</p>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  onClick={startGame}
                  className="rounded-full bg-butter px-6 py-2.5 font-display font-bold text-cocoa active:scale-95 transition-transform"
                >
                  Reintentar
                </button>
                <Link
                  to="/ayuda"
                  className="rounded-full border-2 border-cream px-6 py-2.5 font-display font-bold text-cream active:scale-95 transition-transform"
                >
                  Ayudar a Maylu 💛
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {gamePhase === "playing" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "12px 0 14px",
            background: "rgba(255,217,61,0.08)",
          }}
        >
          <button
            onTouchStart={(e) => { e.preventDefault(); shoot(); }}
            onClick={shoot}
            style={{
              background: C.butter,
              border: "none",
              borderRadius: 40,
              color: C.cocoa,
              fontSize: 24,
              padding: "10px 44px",
              cursor: "pointer",
              letterSpacing: 2,
              fontWeight: 700,
              boxShadow: "0 4px 0 #D4A020",
              transition: "transform 0.1s, box-shadow 0.1s",
            }}
          >
            ⚡ DISPARAR
          </button>
        </div>
      )}
    </div>
  );
}

const overlayStart: Record<string, string | number> = {
  position: "absolute",
  inset: 0,
  background: "rgba(92,58,30,0.88)",
  backdropFilter: "blur(2px)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 24px",
};

const btnStyle: Record<string, string | number> = {
  background: "linear-gradient(135deg, #FFD93D, #F5C518)",
  color: "#5C3A1E",
  border: "none",
  borderRadius: 12,
  padding: "12px 36px",
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
  letterSpacing: 0.5,
  boxShadow: "0 4px 0 #D4A020",
  transition: "transform 0.1s, box-shadow 0.1s",
};
