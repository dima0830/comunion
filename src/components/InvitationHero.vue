<template>
  <section id="inicio" class="hero-section">
    <!-- degradado oscuro para leer los textos sobre el video de fondo -->
    <div class="velo" aria-hidden="true"></div>

    <!-- pétalos que caen sobre el video -->
    <div class="petalos" aria-hidden="true">
      <span v-for="p in petalos" :key="p.id" class="petalo" :style="p.estilo"></span>
    </div>

    <!-- rosas colgando desde el borde superior -->
    <GuirnaldaFlores tipo="arriba" />

    <div class="hero-contenido">
      <!-- cáliz con la hostia y rayos de luz -->
      <svg class="caliz" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <g class="rayos">
          <path d="M32 3v5M20 7l2.5 4.3M44 7l-2.5 4.3M11.5 15l4.3 2.5M52.5 15l-4.3 2.5" />
        </g>
        <circle cx="32" cy="20" r="7.5" />
        <path d="M29 20h6M32 17v6" />
        <path d="M16 29h32c0 9-6.5 15-16 15S16 38 16 29z" />
        <path d="M32 44v9M23 59h18M25.5 59c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" />
      </svg>

      <p class="antetitulo">MI PRIMERA COMUNIÓN</p>

      <h1 class="nombres">
        <span class="nombre">{{ datos.nombre }}</span>
      </h1>
      <span class="filete" aria-hidden="true"></span>
      <p class="dia-boda">{{ datos.frase }}</p>
      <p class="fecha">{{ datos.cita }}</p>
    </div>

    <a href="#fecha" class="indicador-scroll" aria-label="Desliza hacia abajo">
      <span class="texto-desliza">DESLIZA ABAJO</span>
      <svg
        class="flecha-saltarina"
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M12 5v14M19 12l-7 7-7-7" />
      </svg>
    </a>
  </section>
</template>

<script setup lang="ts">
import { datos } from "@/datos";

/* Pétalos con tamaño, posición y ritmo al azar */
const petalos = Array.from({ length: 14 }, (_, id) => ({
  id,
  estilo: {
    left: `${Math.random() * 100}%`,
    width: `${8 + Math.random() * 8}px`,
    animationDuration: `${9 + Math.random() * 8}s`,
    animationDelay: `${-Math.random() * 15}s`,
    "--deriva": `${Math.random() * 120 - 60}px`,
    "--giro": `${Math.random() * 540 - 270}deg`,
    opacity: 0.55 + Math.random() * 0.4,
  },
}));
</script>

<style scoped>
.hero-section {
  --oro: #ead5a6; /* dorado claro: se lee sobre el video */
  --oro-oscuro: #f5ead2;
  --tinta: #4d4b43;

  position: relative;
  width: 100%;
  height: 100vh;
  height: 100svh;
  min-height: 600px;
  max-height: 900px;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;
  /* transparente: detrás se ve el video de fondo de la invitación */
  background: transparent;
}

/* Degradado: oscurece arriba y en el centro para leer los textos blancos */
.velo {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 45% at 50% 55%, rgba(20, 16, 10, 0.35), rgba(20, 16, 10, 0) 70%),
    linear-gradient(180deg, rgba(20, 16, 10, 0.45) 0%, rgba(20, 16, 10, 0.1) 40%, rgba(20, 16, 10, 0.3) 100%);
}

/* PÉTALOS */
.petalos {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
}

.petalo {
  position: absolute;
  top: -20px;
  aspect-ratio: 1 / 1.3;
  border-radius: 80% 0 80% 0;
  background: radial-gradient(circle at 30% 30%, #fffdf8, #efe4d2 70%, #e0cfb4);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  animation: caerPetalo linear infinite;
}

@keyframes caerPetalo {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    transform: translate(var(--deriva), 105vh) rotate(var(--giro));
  }
}

.hero-contenido {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 760px;
  /* deja sitio arriba para las rosas y abajo para el divisor y el indicador */
  padding: 110px 16px 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.caliz {
  width: 74px;
  height: 74px;
  margin-bottom: 14px;
  color: var(--oro);
  filter: drop-shadow(0 1px 6px rgba(0, 0, 0, 0.4));
  animation: aparecer 1s ease 0.1s both;
}

/* los rayos de luz brillan suavemente */
.caliz .rayos {
  animation: brillar 2.6s ease-in-out 1.2s infinite;
}

@keyframes brillar {
  0%,
  100% {
    opacity: 0.35;
  }
  50% {
    opacity: 1;
  }
}

.antetitulo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 14px;
  font-family: "Cinzel", "Cormorant Garamond", serif;
  font-size: clamp(0.85rem, 3.6vw, 1.1rem);
  font-weight: 600;
  letter-spacing: 3px;
  white-space: nowrap;
  color: #fff;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.45);
  animation: aparecer 1s ease 0.2s both;
}

/* líneas doradas a los lados */
.antetitulo::before,
.antetitulo::after {
  content: "";
  width: clamp(16px, 5vw, 48px);
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--oro-oscuro));
}
.antetitulo::after {
  background: linear-gradient(90deg, var(--oro-oscuro), transparent);
}

/* TEXTOS */
.nombres {
  margin: 12px 0 0;
  font-family: "Great Vibes", cursive;
  font-weight: 400;
  font-size: clamp(4.2rem, 20vw, 5.4rem);
  line-height: 0.95;
  letter-spacing: 0;
  color: #fff;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.45);
}

/* cada nombre se descubre de izquierda a derecha, como escrito a mano */
.nombre {
  display: block;
  padding: 0 0.2em;
  white-space: nowrap;
  animation: escribir 1.6s cubic-bezier(0.55, 0, 0.3, 1) 0.6s both;
}

/* filete dorado bajo los nombres */
.filete {
  display: block;
  width: 120px;
  height: 1px;
  margin: 14px auto 0;
  background: linear-gradient(90deg, transparent, var(--oro), transparent);
  animation: dibujar 1.1s ease 2.1s both;
}

.dia-boda {
  margin: 14px 0 0;
  font-family: "Cormorant Garamond", serif;
  font-style: italic;
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1;
  color: #fff;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.5);
  animation: aparecer 1.1s ease 2.4s both;
}

.fecha {
  margin: 8px 0 0;
  font-family: "Cinzel", serif;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 2.5px;
  color: #fff;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.5);
  animation: aparecer 1.1s ease 2.7s both;
}

.indicador-scroll {
  position: absolute;
  bottom: 104px;
  left: 0;
  right: 0;
  width: fit-content;
  margin: 0 auto;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: var(--oro-oscuro);
  text-decoration: none;
  animation: aparecer 1s ease 3.4s both;
}

.texto-desliza {
  font-family: "Cinzel", serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 3px;
}

.flecha-saltarina {
  animation: rebotar 1.8s infinite;
}

@keyframes escribir {
  from {
    /* márgenes negativos: los trazos de la cursiva que sobresalen arriba,
       abajo y a los lados nunca se recortan */
    clip-path: inset(-60% 100% -60% -20%);
    filter: blur(3px);
  }
  to {
    clip-path: inset(-60% -20% -60% -20%);
    filter: blur(0);
  }
}

@keyframes dibujar {
  from {
    width: 0;
  }
  to {
    width: 120px;
  }
}

@keyframes aparecer {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes rebotar {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
  60% {
    transform: translateY(-4px);
  }
}

/* Sin animación si el usuario lo prefiere: se muestra directamente el final */
@media (prefers-reduced-motion: reduce) {
  .hero-section *,
  .hero-section *::before {
    animation: none !important;
  }
}

@media (max-height: 700px) {
  .indicador-scroll {
    display: none;
  }
  .hero-contenido {
    padding: 90px 16px 80px;
  }
}

@media (max-height: 640px) {
  .nombres {
    font-size: 3.2rem;
  }
}
</style>
