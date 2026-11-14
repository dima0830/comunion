<template>
  <!--
    PORTADA como una sola composición: textos arriba, la niña fundida con el
    fondo y rosas en las esquinas de la base.
  -->
  <!--
    PISTA: un contenedor alto. La portada se queda fija (sticky) mientras
    bajas por él, y --p (0 → 1) cuenta cuánto has recorrido: con eso las
    letras se separan, las rosas se abren como un telón y la niña crece.
  -->
  <div ref="pistaRef" class="pista">
  <section id="inicio" class="portada" :class="{ entrar: activa }">
    <img :src="fondo" alt="" class="fondo" aria-hidden="true" />
    <div class="velo" aria-hidden="true"></div>
    <MariposasVolando :cantidad="3" />

    <div class="textos">
      <!-- cruz con rayos de luz -->
      <svg class="cruz" viewBox="0 0 120 50" fill="none" stroke="currentColor" stroke-linecap="round" aria-hidden="true">
        <g class="rayos" stroke-width="0.8">
          <path d="M60 4V0M48 8l-3-3M72 8l3-3M44 18h-4M76 18h4" />
        </g>
        <path d="M60 6v30M53 15h14" stroke-width="2.2" />
      </svg>

      <p class="te-invito">TE INVITO A MI</p>
      <!-- cada letra es un span para poder separarlas al bajar -->
      <p class="primera" aria-label="Primera Comunión">
        <span v-for="(linea, l) in lineas" :key="l" class="linea" aria-hidden="true">
          <span v-for="letra in linea" :key="letra.i" class="letra metal-oro" :style="letra.estilo">{{ letra.c }}</span>
        </span>
      </p>
      <h1 class="nombre oro-brillante">{{ datos.nombre }}</h1>

      <div class="fila-fecha">
        <span class="lado">{{ fechaPartes.diaSemana }}</span>
        <span class="dia">{{ fechaPartes.dia }}</span>
        <span class="lado">{{ fechaPartes.mes.toUpperCase() }} {{ fechaPartes.anio }}</span>
      </div>
    </div>

    <!-- la niña -->
    <div v-if="videoProtagonista || imagenProtagonista" class="ilustracion">
      <video
        v-if="videoProtagonista"
        ref="videoRef"
        :src="videoProtagonista"
        muted
        playsinline
        autoplay
        loop
        preload="auto"
        aria-hidden="true"
      ></video>
      <img v-else :src="imagenProtagonista!" :alt="`Ilustración de ${datos.nombre}`" />
    </div>

    <!-- rosas en las esquinas -->
    <img :src="rosas" alt="" class="rosas izquierda" aria-hidden="true" />
    <img :src="rosas" alt="" class="rosas derecha" aria-hidden="true" />

    <a href="#fecha" class="desliza" aria-label="Desliza hacia abajo">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </a>

    <GuirnaldaFlores />
  </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { usarProgresoPista } from "@/progresoPista";
import { datos, fechaPartes } from "@/datos";
import fondo from "@/assets/images/fondo-portada.webp";
import rosas from "@/assets/images/rosas-esquina.webp";

defineProps<{ activa: boolean }>();

const videos = import.meta.glob<string>("../assets/videos/protagonista.{mp4,webm}", { eager: true, query: "?url", import: "default" });
const imagenes = import.meta.glob<string>("../assets/images/protagonista.{webp,png,jpg}", { eager: true, query: "?url", import: "default" });
const videoProtagonista = Object.values(videos)[0] ?? null;
const imagenProtagonista = Object.values(imagenes)[0] ?? null;

/*
  Letras de "PRIMERA COMUNIÓN". Cada una tiene:
  --d: cuándo empieza a irse (0 = primero, 1 = último), en orden desordenado
  --x: hacia qué lado se va, --r: cuánto gira
*/
const textoLineas = ["PRIMERA", "COMUNIÓN"];
const totalLetras = textoLineas.join("").length;
let contador = 0;
const lineas = textoLineas.map((palabra) =>
  [...palabra].map((c) => {
    const i = contador++;
    return {
      c,
      i,
      estilo: {
        "--d": ((i * 7) % totalLetras) / (totalLetras - 1),
        "--x": (((i * 37) % 11) - 5) / 5,
        "--r": ((i * 53) % 21) - 10,
      },
    };
  }),
);

const videoRef = ref<HTMLVideoElement | null>(null);
const pistaRef = ref<HTMLElement | null>(null);

/* --p y --pe: progreso del recorrido (0 arriba, 1 cuando la portada se suelta) */
usarProgresoPista(pistaRef);

onMounted(() => {
  const v = videoRef.value;
  if (!v) return;
  v.muted = true;
  v.setAttribute("muted", "");
  v.setAttribute("playsinline", "");
  v.play().catch(() => {});
});
</script>

<style scoped>
/* PISTA: 100svh de portada + 140svh de recorrido mientras queda fija */
.pista {
  --p: 0;
  --pe: 0;
  position: relative;
  height: 240vh;
  height: 240svh;
}

.portada {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  height: 100svh;
  padding: 70px 0 0;
  overflow: hidden;
  background: #f6ebe4;
}

/*
  MOVIMIENTO AL BAJAR. Solo se usan translate/scale/rotate (y opacidad donde
  no hay animación de entrada), que el celular mueve sin trabarse. Son
  propiedades separadas de "transform", así no chocan con las animaciones.
*/

/* el fondo se acerca despacio: profundidad */
.fondo {
  scale: calc(1 + var(--pe) * 0.12);
}

/* el bloque de textos sube y se desvanece en la segunda parte */
.textos {
  translate: 0 calc(var(--p) * -14svh);
  opacity: calc(1 - clamp(0, (var(--p) - 0.16) / 0.2, 1));
}

/* el nombre crece un poco antes de irse */
.nombre {
  scale: calc(1 + var(--p) * 0.12);
}

/*
  la niña crece hacia arriba desde los pies: el borde del vestido se queda
  quieto, siempre tapado por las rosas, y ella llena el espacio de los textos
*/
.ilustracion {
  scale: calc(1 + var(--pe) * 0.5);
  transform-origin: 50% 100%;
}

/* las rosas se quedan encima del vestido y crecen un poco (primer plano) */
.rosas.izquierda {
  scale: calc(1 + var(--pe) * 0.18);
}
.rosas.derecha {
  scale: calc(-1 - var(--pe) * 0.18) calc(1 + var(--pe) * 0.18);
}

/* la flecha se esconde apenas empiezas a bajar */
.desliza {
  translate: 0 calc(clamp(0, var(--p) / 0.08, 1) * 160px);
}

.fondo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 30%;
  animation: respirarFondo 18s ease-in-out infinite alternate;
}

/* velo marfil: el fondo queda suave y luminoso, como papel fino */
.velo {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 50% at 50% 30%, rgba(255, 251, 247, 0.92), rgba(255, 251, 247, 0.55) 70%),
    linear-gradient(180deg, rgba(255, 250, 246, 0.35), rgba(255, 250, 246, 0));
}

@keyframes respirarFondo {
  to {
    transform: scale(1.06);
  }
}

/* TEXTOS */
.textos {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 44px;
  text-align: center;
}

.cruz {
  width: 90px;
  color: var(--oro);
  margin-bottom: 6px;
}

.cruz .rayos {
  animation: brillar 2.6s ease-in-out infinite;
}

@keyframes brillar {
  50% {
    opacity: 0.3;
  }
}

.te-invito {
  margin: 0;
  font-family: var(--fuente-mayus);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 5px;
  color: var(--oro-rosa);
}

/* PRIMERA COMUNIÓN en mayúsculas doradas metálicas */
.primera {
  margin: 8px 0 0;
  font-family: var(--fuente-titulo);
  font-size: clamp(2.3rem, 11vw, 3rem);
  line-height: 1.02;
  letter-spacing: 3px;
}

/* cada palabra en su línea, sin cortarse */
.linea {
  display: block;
  white-space: nowrap;
}

/*
  LETRAS: cada una se va a su ritmo (--d), hacia un lado (--x), girando (--r).
  El padding deja espacio a la tilde de la Ó para que el dorado no la corte.
*/
.letra {
  --lp: clamp(0, (var(--p) - 0.02 - var(--d) * 0.18) / 0.16, 1);
  display: inline-block;
  padding-block: 0.16em 0.06em;
  margin-block: -0.16em -0.06em;
  translate: calc(var(--x) * var(--lp) * 2.6em) calc(var(--lp) * -0.8em);
  rotate: calc(var(--r) * var(--lp) * 2.4deg);
  opacity: calc(1 - var(--lp));
}

.metal-oro {
  background: linear-gradient(180deg, #d9b768 0%, #a8803a 55%, #c9a15a 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.nombre {
  margin: 0;
  padding: 0 0.15em;
  font-family: var(--fuente-cursiva);
  font-size: clamp(3.6rem, 17vw, 4.6rem);
  font-weight: 400;
  line-height: 1.3;
}

/* DOMINGO | 16 | MAYO 2027 */
.fila-fecha {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 4px;
  font-family: var(--fuente-mayus);
  color: var(--titulo);
}

.lado {
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 3px;
}

.dia {
  font-family: var(--fuente-titulo);
  font-size: 2.8rem;
  font-weight: 400;
  line-height: 1;
  color: var(--oro-rosa);
}

/* LA NIÑA: se funde con el fondo */
.ilustracion {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 400px;
  margin-top: 4px;
  margin-bottom: 30px;
}

.ilustracion video,
.ilustracion img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  object-position: 50% 100%;
  -webkit-mask-image: radial-gradient(ellipse 56% 64% at 50% 60%, #000 55%, transparent 100%);
  mask-image: radial-gradient(ellipse 56% 64% at 50% 60%, #000 55%, transparent 100%);
}

/* ROSAS en las esquinas */
.rosas {
  position: absolute;
  bottom: 70px;
  z-index: 3;
  width: 44%;
  max-width: 200px;
  pointer-events: none;
  filter: drop-shadow(0 6px 8px rgba(120, 70, 60, 0.25));
  transform-origin: 50% 100%;
  animation: mecer 7s ease-in-out infinite alternate;
}

.rosas.izquierda {
  left: -6%;
}

/* (el reflejo -1 lo pone la regla de movimiento de arriba, que además la hace crecer) */
.rosas.derecha {
  right: -6%;
  animation-delay: -3.5s;
}

@keyframes mecer {
  from {
    rotate: -1.5deg;
  }
  to {
    rotate: 2deg;
  }
}

/* ENTRADA al abrir el sobre */
.textos > *,
.ilustracion,
.rosas,
.desliza {
  opacity: 0;
}

.entrar .textos > * {
  animation: luz 1.1s ease both;
}
.entrar .textos > :nth-child(1) { animation-delay: 0.7s; }
.entrar .textos > :nth-child(2) { animation-delay: 0.9s; }
.entrar .textos > :nth-child(3) { animation-delay: 1.1s; }
.entrar .textos > :nth-child(4) { animation-delay: 1.5s; }
.entrar .textos > :nth-child(5) { animation-delay: 1.9s; }
.entrar .ilustracion { animation: subir 1.6s cubic-bezier(0.16, 1, 0.3, 1) 1.2s both; }
.entrar .rosas { animation: florecer 1.2s cubic-bezier(0.34, 1.4, 0.64, 1) 1.6s both, mecer 7s ease-in-out 2.8s infinite alternate; }
.entrar .desliza { animation: luz 1s ease 2.6s both, rebotar 2s ease-in-out 3.6s infinite; }

@keyframes luz {
  from {
    opacity: 0;
    filter: blur(10px);
    transform: scale(1.06);
  }
  to {
    opacity: 1;
    filter: blur(0);
    transform: none;
  }
}

@keyframes subir {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes florecer {
  from {
    opacity: 0;
    transform: scale(0.6) translateY(30px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.desliza {
  position: absolute;
  bottom: 86px;
  left: calc(50% - 18px);
  z-index: 6;
  width: 36px;
  height: 36px;
  padding: 6px;
  border-radius: 50%;
  background: rgba(255, 253, 251, 0.9);
  color: var(--oro-rosa);
  box-shadow: 0 4px 12px rgba(120, 70, 60, 0.2);
}

@keyframes rebotar {
  50% {
    transform: translateY(6px);
  }
}

@media (prefers-reduced-motion: reduce) {
  /* sin portada fija: la página baja normal */
  .pista {
    height: auto;
  }
  .portada {
    position: relative;
    height: auto;
    min-height: 100svh;
  }
  .portada *,
  .fondo {
    animation: none !important;
  }
  .textos > *,
  .ilustracion,
  .rosas,
  .desliza {
    opacity: 1;
  }
}
</style>
