import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";

type GameState = "idle" | "playing" | "gameover";

const W = 720;
const H = 260;
const GROUND_Y = 210;
const GRAVITY = 0.65;
const JUMP_V = -14;
const BASE_SPEED = 2.8;

type Obstacle = {
  x: number;
  w: number;
  h: number;
  y: number;
  kind: "cactus" | "syringe" | "bird" | "pill" | "cone";
};

type Coin = { x: number; y: number; taken: boolean; pulse: number };

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
};

type Cloud = { x: number; y: number; w: number; speed: number };

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

function randomFact(prev?: string): string {
  let f = VIRINGO_FACTS[Math.floor(Math.random() * VIRINGO_FACTS.length)];
  if (prev && VIRINGO_FACTS.length > 1) {
    while (f === prev)
      f = VIRINGO_FACTS[Math.floor(Math.random() * VIRINGO_FACTS.length)];
  }
  return f;
}

const C = {
  sky1: "#FFF8E7",
  sky2: "#FFE5A0",
  ground: "#C8960C",
  groundFill: "#E8C84A",
  dirt: "#7B4A2D",
  dog: "#0b0b0b",
  dogAccent: "#1f1f1f",
  coin: "#FFD93D",
  coinEdge: "#C8960C",
  green: "#5e8b3a",
  red: "#e94d4d",
  white: "#fff",
  cream: "#FFF8E7",
  cocoa: "#5C3A1E",
  butter: "#F5C518",
  particle1: "#FFD93D",
  particle2: "#FF8C42",
  particle3: "#5e8b3a",
};

export function MayluRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [fact, setFact] = useState<string>(() => randomFact());
  const jumpPressedRef = useRef(false);
  const duckPressedRef = useRef(false);

  const start = useCallback(() => {
    setScore(0);
    setCoinsCollected(0);
    setState("playing");
  }, []);

  useEffect(() => {
    if (state !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let dogX = 70;
    let dogY = GROUND_Y;
    let dogV = 0;
    let jumpsLeft = 2;
    let ducking = false;
    let obstacles: Obstacle[] = [];
    let coins: Coin[] = [];
    let particles: Particle[] = [];
    let clouds: Cloud[] = [
      { x: 100, y: 30, w: 80, speed: 0.3 },
      { x: 320, y: 20, w: 60, speed: 0.2 },
      { x: 560, y: 40, w: 100, speed: 0.25 },
    ];
    let frame = 0;
    let speed = BASE_SPEED;
    let localScore = 0;
    let localCoins = 0;
    let nextSpawn = 100;
    let nextCoin = 130;
    let shakeFrames = 0;
    let invincible = 0; // brief invincibility after near-miss (unused but kept)

    const jump = () => {
      if (jumpsLeft > 0) {
        dogV = JUMP_V * (jumpsLeft === 2 ? 1 : 0.82);
        jumpsLeft--;
        spawnJumpParticles();
      }
    };
    const duckDown = (v: boolean) => {
      ducking = v && dogY >= GROUND_Y - 2;
    };

    const keyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      } else if (e.code === "ArrowDown") {
        e.preventDefault();
        duckDown(true);
      }
    };
    const keyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowDown") duckDown(false);
    };

    const pointer = (e: PointerEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const y = e.clientY - rect.top;
      if (y > rect.height * 0.65) {
        duckDown(true);
        setTimeout(() => duckDown(false), 380);
      } else {
        jump();
      }
    };

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    canvas.addEventListener("pointerdown", pointer);

    const pollVirtual = () => {
      if (jumpPressedRef.current) {
        jumpPressedRef.current = false;
        jump();
      }
      if (duckPressedRef.current) {
        duckDown(true);
      } else {
        if (ducking) duckDown(false);
      }
    };

    const spawnJumpParticles = () => {
      for (let i = 0; i < 5; i++) {
        particles.push({
          x: dogX + 22,
          y: dogY,
          vx: (Math.random() - 0.5) * 3,
          vy: Math.random() * -2 - 1,
          life: 18,
          maxLife: 18,
          color: i % 2 === 0 ? C.coin : C.dirt,
          size: 3 + Math.random() * 3,
        });
      }
    };

    const spawnCoinParticles = (x: number, y: number) => {
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * (1.5 + Math.random() * 2),
          vy: Math.sin(angle) * (1.5 + Math.random() * 2),
          life: 22,
          maxLife: 22,
          color: i % 3 === 0 ? C.particle2 : C.particle1,
          size: 4 + Math.random() * 3,
        });
      }
    };

    const spawnDeathParticles = (x: number, y: number) => {
      for (let i = 0; i < 14; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 6,
          vy: Math.random() * -5 - 2,
          life: 30,
          maxLife: 30,
          color: [C.red, C.coin, C.dirt][i % 3],
          size: 5 + Math.random() * 5,
        });
      }
    };

    const spawnObstacle = () => {
      const r = Math.random();
      let kind: Obstacle["kind"];
      if (localScore > 400 && r < 0.2) kind = "bird";
      else if (r < 0.35) kind = "cactus";
      else if (r < 0.6) kind = "syringe";
      else if (r < 0.8) kind = "pill";
      else kind = "cone";

      if (kind === "bird") {
        const flyH = Math.random() < 0.5 ? 65 : 95;
        obstacles.push({ x: W + 20, w: 30, h: 20, y: GROUND_Y - flyH, kind });
      } else if (kind === "cactus") {
        obstacles.push({ x: W + 20, w: 18, h: 38, y: GROUND_Y - 38, kind });
      } else if (kind === "syringe") {
        obstacles.push({ x: W + 20, w: 28, h: 14, y: GROUND_Y - 14, kind });
      } else if (kind === "pill") {
        obstacles.push({ x: W + 20, w: 22, h: 22, y: GROUND_Y - 22, kind });
      } else {
        obstacles.push({ x: W + 20, w: 20, h: 30, y: GROUND_Y - 30, kind });
      }
    };

    const spawnCoin = () => {
      const row = Math.random() < 0.3;
      const baseY = GROUND_Y - 45 - Math.random() * 60;
      const count = row ? 3 : 1;
      for (let i = 0; i < count; i++) {
        coins.push({ x: W + 20 + i * 36, y: baseY, taken: false, pulse: i * 0.8 });
      }
    };

    const drawCloud = (c: Cloud) => {
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, c.w / 2, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(c.x - c.w * 0.2, c.y + 4, c.w * 0.28, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(c.x + c.w * 0.2, c.y + 6, c.w * 0.22, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawDog = (x: number, y: number) => {
      ctx.save();
      if (shakeFrames > 0) {
        ctx.translate(
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3
        );
      }

      const bodyH = ducking ? 9 : 13;
      const bodyOffY = ducking ? -9 : -16;
      const legLen = ducking ? 5 : 9;
      const legPhase = Math.floor(frame / 5) % 2;

      ctx.fillStyle = "rgba(0,0,0,0.12)";
      ctx.beginPath();
      ctx.ellipse(x + 26, GROUND_Y + 4, 22, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(x + 2, y - 20);
      const tailWag = Math.sin(frame * 0.25) * 8;
      ctx.quadraticCurveTo(x - 12, y - 28 + tailWag, x - 5, y - 34 + tailWag);
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = C.dog;
      ctx.lineCap = "round";
      ctx.stroke();

      ctx.fillStyle = C.dog;
      ctx.beginPath();
      ctx.ellipse(x + 24, y + bodyOffY, 23, bodyH, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = C.dog;
      const l1 = legPhase ? legLen + 3 : legLen;
      const l2 = legPhase ? legLen : legLen + 3;
      ctx.beginPath();
      ctx.roundRect(x + 10, y - 6, 5, l1, 2);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(x + 36, y - 6, 5, l2, 2);
      ctx.fill();

      const headY = ducking ? y - 12 : y - 24;
      const headX = ducking ? x + 52 : x + 46;
      ctx.fillStyle = C.dog;
      ctx.beginPath();
      ctx.ellipse(headX, headY, 11, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(headX - 5, headY - 9);
      ctx.lineTo(headX - 1, headY - 20);
      ctx.lineTo(headX + 4, headY - 9);
      ctx.fill();

      ctx.fillStyle = C.dogAccent;
      ctx.beginPath();
      ctx.ellipse(headX + 8, headY + 2, 6, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#1a0e08";
      ctx.beginPath();
      ctx.ellipse(headX + 12, headY + 1, 2, 1.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = C.white;
      ctx.beginPath();
      ctx.ellipse(headX + 2, headY - 2, 3, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1a0e08";
      ctx.beginPath();
      ctx.ellipse(headX + 3, headY - 2, 2, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = C.white;
      ctx.beginPath();
      ctx.ellipse(headX + 4, headY - 3, 0.8, 0.8, 0, 0, Math.PI * 2);
      ctx.fill();

      if (speed > 7) {
        ctx.fillStyle = C.red;
        ctx.beginPath();
        ctx.ellipse(headX + 9, headY + 7, 2.5, 4, 0.3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const drawObstacle = (o: Obstacle) => {
      if (o.kind === "cactus") {
        ctx.fillStyle = C.green;
        ctx.beginPath();
        ctx.roundRect(o.x + 4, o.y, 10, o.h, 4);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(o.x - 6, o.y + 10, 10, 12, 3);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(o.x - 6, o.y + 10, 6, 4, 2);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(o.x + o.w - 4, o.y + 14, 10, 12, 3);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(o.x + o.w - 4, o.y + 14, 6, 4, 2);
        ctx.fill();
        ctx.strokeStyle = "#3a5f1e";
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(o.x, o.y + 8 + i * 10);
          ctx.lineTo(o.x - 5, o.y + 5 + i * 10);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(o.x + o.w, o.y + 8 + i * 10);
          ctx.lineTo(o.x + o.w + 5, o.y + 5 + i * 10);
          ctx.stroke();
        }
      } else if (o.kind === "syringe") {
        ctx.fillStyle = "#dce8f0";
        ctx.beginPath();
        ctx.roundRect(o.x, o.y + 2, o.w, o.h - 4, 3);
        ctx.fill();
        ctx.fillStyle = "#e94d8a";
        ctx.beginPath();
        ctx.roundRect(o.x + 2, o.y + 4, (o.w - 4) * 0.7, o.h - 8, 2);
        ctx.fill();
        ctx.fillStyle = "#90a4ae";
        ctx.beginPath();
        ctx.moveTo(o.x + o.w, o.y + o.h / 2 - 2);
        ctx.lineTo(o.x + o.w + 10, o.y + o.h / 2);
        ctx.lineTo(o.x + o.w, o.y + o.h / 2 + 2);
        ctx.fill();
        ctx.fillStyle = "#7B4A2D";
        ctx.beginPath();
        ctx.roundRect(o.x - 8, o.y - 1, 8, o.h + 2, 2);
        ctx.fill();
        ctx.strokeStyle = "#90a4ae";
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(o.x + 6 + i * 6, o.y + 2);
          ctx.lineTo(o.x + 6 + i * 6, o.y + 5);
          ctx.stroke();
        }
      } else if (o.kind === "pill") {
        ctx.fillStyle = C.butter;
        ctx.beginPath();
        ctx.roundRect(o.x, o.y, o.w, o.h, o.w / 2);
        ctx.fill();
        ctx.fillStyle = "#e0a800";
        ctx.beginPath();
        ctx.roundRect(o.x + o.w / 2, o.y, o.w / 2, o.h, [0, o.w / 2, o.w / 2, 0]);
        ctx.fill();
        ctx.strokeStyle = "#c88f00";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(o.x + o.w / 2, o.y + 2);
        ctx.lineTo(o.x + o.w / 2, o.y + o.h - 2);
        ctx.stroke();
      } else if (o.kind === "cone") {
        ctx.fillStyle = C.red;
        ctx.beginPath();
        ctx.moveTo(o.x + o.w / 2, o.y);
        ctx.lineTo(o.x + o.w, o.y + o.h);
        ctx.lineTo(o.x, o.y + o.h);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = C.white;
        ctx.lineWidth = 2;
        for (let i = 1; i <= 2; i++) {
          const t = i / 3;
          const yy = o.y + o.h * t;
          const halfW = (o.w / 2) * t;
          ctx.beginPath();
          ctx.moveTo(o.x + o.w / 2 - halfW, yy);
          ctx.lineTo(o.x + o.w / 2 + halfW, yy);
          ctx.stroke();
        }
        ctx.fillStyle = "#c0c0c0";
        ctx.beginPath();
        ctx.roundRect(o.x - 2, o.y + o.h - 4, o.w + 4, 4, 2);
        ctx.fill();
      } else {
        const flap = Math.floor(frame / 7) % 2 === 0 ? -7 : 5;
        ctx.fillStyle = C.dogAccent;
        ctx.beginPath();
        ctx.ellipse(o.x + 15, o.y + 10, 13, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(o.x + 9, o.y + 10);
        ctx.lineTo(o.x + 15, o.y + 10 + flap);
        ctx.lineTo(o.x + 21, o.y + 10);
        ctx.fill();
        ctx.fillStyle = C.butter;
        ctx.beginPath();
        ctx.moveTo(o.x + 27, o.y + 10);
        ctx.lineTo(o.x + 33, o.y + 13);
        ctx.lineTo(o.x + 27, o.y + 14);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = C.white;
        ctx.beginPath();
        ctx.arc(o.x + 24, o.y + 9, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#1a0e08";
        ctx.beginPath();
        ctx.arc(o.x + 25, o.y + 9, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawCoin = (c: Coin) => {
      if (c.taken) return;
      c.pulse += 0.12;
      const bounce = Math.sin(c.pulse) * 3;
      const y = c.y + bounce;
      const r = 9;

      ctx.strokeStyle = "rgba(255, 217, 61, 0.35)";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(c.x, y, r + 4, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = C.coin;
      ctx.beginPath();
      ctx.arc(c.x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = C.coinEdge;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = C.cocoa;
      ctx.font = "bold 11px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🦴", c.x, y + 1);
    };

    const drawParticles = () => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.life--;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        const alpha = p.life / p.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    };

    const drawGround = () => {
      ctx.fillStyle = C.groundFill;
      ctx.fillRect(0, GROUND_Y + 2, W, H - GROUND_Y - 2);

      ctx.strokeStyle = C.ground;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y + 2);
      ctx.lineTo(W, GROUND_Y + 2);
      ctx.stroke();

      ctx.fillStyle = C.coinEdge;
      for (let i = 0; i < 10; i++) {
        const raw = i * 90 - (frame * speed * 0.6);
        const x = ((raw % (W + 90)) + (W + 90)) % (W + 90);
        ctx.fillRect(x, GROUND_Y + 10, 30, 2);
      }

      ctx.fillStyle = "rgba(180,130,60,0.5)";
      for (let i = 0; i < 8; i++) {
        const raw = i * 100 + 30 - frame * speed * 0.8;
        const x = ((raw % (W + 100)) + (W + 100)) % (W + 100);
        ctx.beginPath();
        ctx.ellipse(x, GROUND_Y + 6, 3, 2, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      frame++;
      pollVirtual();
      if (shakeFrames > 0) shakeFrames--;

      // Sky
      const t = (Math.sin(frame / 700) + 1) / 2;
      const skyColor = `rgb(${Math.round(255)}, ${Math.round(240 - t * 20)}, ${Math.round(200 - t * 60)})`;
      ctx.fillStyle = skyColor;
      ctx.fillRect(0, 0, W, H);

      // Sun
      const sunSize = 20 + Math.sin(frame * 0.01) * 2;
      ctx.fillStyle = t > 0.5 ? "#FFD93D" : "#ffa040";
      ctx.beginPath();
      ctx.arc(W - 70, 44, sunSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = t > 0.5 ? "rgba(255,217,61,0.4)" : "rgba(255,160,64,0.4)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 * i) / 8 + frame * 0.005;
        ctx.beginPath();
        ctx.moveTo(W - 70 + Math.cos(a) * (sunSize + 4), 44 + Math.sin(a) * (sunSize + 4));
        ctx.lineTo(W - 70 + Math.cos(a) * (sunSize + 12), 44 + Math.sin(a) * (sunSize + 12));
        ctx.stroke();
      }

      clouds.forEach((c) => {
        c.x -= c.speed;
        if (c.x + c.w < -10) c.x = W + c.w;
        drawCloud(c);
      });

      drawGround();

      dogV += GRAVITY;
      dogY += dogV;
      if (dogY >= GROUND_Y) {
        dogY = GROUND_Y;
        dogV = 0;
        jumpsLeft = 2;
      }
      drawDog(dogX, dogY);

      nextSpawn--;
      if (nextSpawn <= 0) {
        spawnObstacle();
        const diff = Math.min(40, localScore / 60);
        nextSpawn = Math.max(45, 85 + Math.floor(Math.random() * 80) - diff);
      }
      nextCoin--;
      if (nextCoin <= 0) {
        spawnCoin();
        nextCoin = 130 + Math.floor(Math.random() * 160);
      }

      obstacles.forEach((o) => (o.x -= speed));
      obstacles = obstacles.filter((o) => o.x + o.w > -30);
      obstacles.forEach(drawObstacle);

      coins.forEach((c) => (c.x -= speed));
      coins = coins.filter((c) => c.x > -30 && !c.taken);
      coins.forEach(drawCoin);

      drawParticles();

      const dogBox = ducking
        ? { x: dogX + 4, y: dogY - 16, w: 58, h: 16 }
        : { x: dogX + 8, y: dogY - 36, w: 46, h: 36 };

      for (const c of coins) {
        if (c.taken) continue;
        const dx = c.x - (dogBox.x + dogBox.w / 2);
        const dy = c.y - (dogBox.y + dogBox.h / 2);
        if (dx * dx + dy * dy < 26 * 26) {
          c.taken = true;
          localCoins++;
          localScore += 30;
          setCoinsCollected(localCoins);
          spawnCoinParticles(c.x, c.y);
        }
      }

      for (const o of obstacles) {
        const pad = 5;
        if (
          dogBox.x + pad < o.x + o.w - pad &&
          dogBox.x + dogBox.w - pad > o.x + pad &&
          dogBox.y + pad < o.y + o.h &&
          dogBox.y + dogBox.h > o.y + pad
        ) {
          spawnDeathParticles(dogX + 30, dogY - 20);
          drawParticles();
          const finalScore = localScore;
          setBest((b) => Math.max(b, finalScore));
          setScore(finalScore);
          setFact((prev) => randomFact(prev));
          setState("gameover");
          window.removeEventListener("keydown", keyDown);
          window.removeEventListener("keyup", keyUp);
          canvas.removeEventListener("pointerdown", pointer);
          return;
        }
      }

      localScore += 1;
      if (frame % 4 === 0) setScore(localScore);
      const desiredInc = Math.min(3, localScore / 600);
      const rampFactor = Math.min(1, frame / 3000);
      speed = BASE_SPEED + desiredInc * rampFactor;

      ctx.fillStyle = "rgba(92,58,30,0.85)";
      ctx.beginPath();
      ctx.roundRect(W - 120, 8, 112, 30, 8);
      ctx.fill();
      ctx.fillStyle = C.cream;
      ctx.font = "bold 16px Fredoka, system-ui";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(`${localScore}`, W - 14, 23);

      ctx.fillStyle = "rgba(92,58,30,0.85)";
      ctx.beginPath();
      ctx.roundRect(8, 8, 90, 30, 8);
      ctx.fill();
      ctx.fillStyle = C.cream;
      ctx.textAlign = "left";
      ctx.fillText(`🦴 ${localCoins}`, 16, 23);

      const speedPct = Math.min(1, (speed - BASE_SPEED) / 5.5);
      if (speedPct > 0.3) {
        ctx.fillStyle = "rgba(233,77,77,0.15)";
        ctx.fillRect(0, 0, W * speedPct, 3);
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      canvas.removeEventListener("pointerdown", pointer);
    };
  }, [state]);

  return (
    <div className="mx-auto w-full max-w-3xl select-none" ref={wrapRef}>
      <div className="mb-2 flex items-center justify-between px-1">
        <p className="font-display text-lg font-bold text-cocoa">Maylu Run 🐾</p>
        <div className="flex items-center gap-3">
          <p className="text-sm text-cocoa/70">
            Mejor: <span className="font-bold text-cocoa">{best}</span>
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border-2 border-cocoa bg-cream shadow-xl">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="block h-auto max-h-[48vh] w-full touch-none"
          style={{ aspectRatio: `${W}/${H}` }}
        />

        {state === "idle" && (
          <div className="absolute inset-0 flex items-center justify-center bg-cocoa/75 backdrop-blur-[2px]">
            <div className="max-w-sm px-6 text-center text-cream">
              <p className="text-5xl mb-2">🐾</p>
              <h3 className="font-display text-2xl font-bold">Maylu Run</h3>
              <p className="mt-2 text-sm opacity-90 leading-relaxed">
                Ayuda a Maylu a esquivar obstáculos y recoger monedas 💰
              </p>
              <button
                onClick={start}
                className="mt-4 rounded-full bg-butter px-8 py-3 font-display font-bold text-cocoa text-lg shadow-lg active:scale-95 transition-transform"
              >
                ¡Jugar!
              </button>
              <p className="mt-3 text-xs opacity-60 leading-relaxed">
                <span className="hidden sm:inline">Espacio / ↑ saltar · ↓ agacharse · </span>
                Doble salto disponible
              </p>
            </div>
          </div>
        )}

        {state === "gameover" && (
          <div className="absolute inset-0 flex items-center justify-center bg-cocoa/88 backdrop-blur-[2px] px-4">
            <div className="w-full max-w-md text-center text-cream">
              <p className="text-3xl mb-1">💥</p>
              <h3 className="font-display text-2xl font-bold">¡Game Over!</h3>
              <div className="flex justify-center gap-6 mt-1 text-sm">
                <span>Puntaje: <strong>{score}</strong></span>
                <span>💰 <strong>{coinsCollected}</strong></span>
                {score === best && score > 0 && (
                  <span className="text-butter font-bold">⭐ ¡Nuevo récord!</span>
                )}
              </div>

              <div className="mt-3 rounded-xl border border-butter/40 bg-white/10 p-3 text-left">
                <p className="text-[11px] font-bold uppercase tracking-wider text-butter mb-1">
                  ¿Sabías que? · Viringo peruano
                </p>
                <p className="text-sm leading-snug">{fact}</p>
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  onClick={start}
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

      {state === "playing" && (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:hidden">
          <button
            className="rounded-2xl bg-cocoa py-4 text-xl font-bold text-cream shadow-md transition-all active:scale-95 active:bg-cocoa/70 touch-none"
            onPointerDown={(e) => {
              e.preventDefault();
              jumpPressedRef.current = true;
            }}
          >
            Saltar
          </button>
          <button
            className="rounded-2xl border-2 border-cocoa bg-cream/80 py-4 text-xl font-bold text-cocoa shadow-md transition-all active:scale-95 active:bg-cocoa/10 touch-none"
            onPointerDown={(e) => {
              e.preventDefault();
              duckPressedRef.current = true;
            }}
            onPointerUp={() => {
              duckPressedRef.current = false;
            }}
            onPointerLeave={() => {
              duckPressedRef.current = false;
            }}
          >
            Agachar
          </button>
        </div>
      )}

      {state === "playing" && (
        <p className="mt-2 text-center text-xs text-cocoa/50 hidden sm:block">
          Espacio / ↑ saltar (doble salto) · ↓ agacharse
        </p>
      )}
    </div>
  );
}
