
# Ayuda a Maylu 🐾

Una página web para tu colecta con la estética dulce de Pompompurin (crema, amarillo mantequilla, marrón chocolate, toques blancos) y un mini-juego que cuenta la historia de Maylu.

## Paleta y estilo

- Fondo crema `#FFF8E7`
- Amarillo Pompompurin `#FFD93D` / `#F5C518`
- Marrón gorrito `#7B4A2D`
- Acento rosita `#FFB6B6` para corazones/CTAs suaves
- Tipografías redondeadas (Fredoka / Quicksand) para sensación tierna
- Ilustraciones suaves, bordes redondeados grandes, sombras blandas, stickers de patitas y corazones

## Estructura del sitio (rutas separadas para SEO)

```
src/routes/
  __root.tsx        layout con header (nav: Inicio, Historia, Ayuda, Juego) y footer
  index.tsx         landing: hero con Maylu, llamado urgente, meta de colecta
  historia.tsx      historia completa + galería de fotos
  ayuda.tsx         formas de apoyar: chocotejas, Office, donación directa, contacto WhatsApp
  juego.tsx         mini-juego estilo T-Rex con historia
```

### 1. Inicio (`/`)
- Hero: foto de Maylu (la del retrato rojo), nombre "Maylu", subtítulo "Viringo Peruano · 13 años · Mi compañero desde 2013"
- Bloque de urgencia: resumen del problema (vómito con sangre, necesita endoscopia + exámenes prequirúrgicos)
- Barra de progreso de colecta (monto meta editable, monto recaudado manual)
- CTAs grandes: "Cómo ayudar" y "Conoce su historia"
- Tira de fotos pequeñas (cachorro → adulto → ahora)

### 2. Historia (`/historia`)
- Línea de tiempo con las fotos subidas:
  - 10 marzo 2013: llegada a casa (cachorro dormido en caja roja / acariciado)
  - Crecimiento: con disfraz de lunares, con disfraz de Papá Noel
  - Adulto: foto en la calle, foto en casa con collar rojo
  - Hoy: foto en la veterinaria (con advertencia visual suave, ya que tiene sangre — se puede mostrar con overlay "click para ver" opcional)
- Texto emocional en primera persona

### 3. Cómo ayudar (`/ayuda`)
Cards con la paleta Pompompurin:
- **Chocotejas Pompompurin** — S/ 5 c/u · Pack 3 por S/ 14 · Sabores: Oreo, Pecanas, Manjar Blanco, Trufa · Envío gratis
- **Instalación Office permanente** — S/ 10
- **Donación directa** — espacio para Yape/Plin (placeholder editable)
- Botón "Pedir por WhatsApp" con mensaje pre-llenado
- Mensaje de agradecimiento

### 4. Juego Maylu Run (`/juego`)
Mini-juego estilo dinosaurio de Chrome en canvas:
- Personaje: silueta de Maylu (viringo) corriendo, salta con Espacio / tap
- Obstáculos: huesos, cactus, jeringas (representan los problemas)
- Sistema de puntaje con **checkpoints narrativos** que pausan el juego y muestran una tarjeta con foto + texto, luego "Continuar":

  | Puntos | Foto | Historia |
  |---|---|---|
  | 0 (intro) | cachorro dormido en caja roja | "10 de marzo de 2013. Un cachorrito viringo llegó a mi casa…" |
  | 100 | cachorro acariciado | "Era pequeñito y asustadizo, pero pronto se acostumbró a la familia" |
  | 250 | bebé dormido junto a peluche | "Dormía donde fuera, siempre cerquita nuestro" |
  | 400 | con disfraz de lunares | "Creció travieso y le encantaba que lo vistieran" |
  | 600 | disfraz Papá Noel con los niños | "Pasó navidades, cumpleaños, toda una vida con nosotros" |
  | 800 | adulto en la calle | "Se volvió mi compañero de aventuras" |
  | 1000 | adulto con collar rojo en casa | "13 años a mi lado, mi niño" |
  | 1200 | foto veterinaria | "Hace 2 días empezó a vomitar sangre. Necesita una endoscopia y exámenes para operarse. No quiero rendirme. Ayúdame a salvar a Maylu." + botón "Cómo ayudar" → /ayuda |
- Game over con botón reintentar y link a /ayuda

## Detalles técnicos

- Stack actual: TanStack Start + Tailwind v4 + shadcn (sin cambios)
- Tokens de color y fuentes definidos en `src/styles.css` (oklch) — nada de colores hardcodeados en componentes
- Fotos subidas → `lovable-assets create` desde `/mnt/user-uploads/`, importadas como JSON pointers en `src/assets/`
- Componentes:
  - `src/components/Header.tsx`, `Footer.tsx`
  - `src/components/DonationProgress.tsx`
  - `src/components/HelpCard.tsx`
  - `src/components/TimelineItem.tsx`
  - `src/components/game/MayluRunner.tsx` (canvas + loop), `StoryCard.tsx` (modal de historia), `storyBeats.ts` (datos)
- Cada ruta con su `head()` (title, description, og:title, og:description). `og:image` solo en hojas con la foto principal de Maylu.
- WhatsApp link configurable mediante constante (placeholder hasta que me pases el número)
- Sin backend por ahora: todo estático, monto recaudado y meta como constantes editables

## Lo que necesito confirmar

1. **Número de WhatsApp** y **usuario de Yape/Plin** para los CTAs de pedido y donación (puedo dejar placeholders si prefieres)
2. **Meta de colecta** en soles (para la barra de progreso)
3. ¿Sitio en **español** únicamente? (asumido)
4. La foto de la veterinaria con sangre — ¿la incluyo con overlay "ver foto sensible" o la dejo solo en el final del juego?
