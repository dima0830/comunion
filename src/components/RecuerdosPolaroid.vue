<template>
  <!--
    UN BELLO RECUERDO: las polaroids empiezan apiladas. La sección se queda fija
    mientras bajas y las fotos salen una por una, se inclinan en 3D y se
    reparten sobre la mesa. Al tocar una foto repartida, se ve en grande.
  -->
  <section
    id="recuerdos"
    ref="pistaRef"
    class="recuerdos panel"
    :class="{ 'con-pista': fotos.length > 1 }"
    :style="{ '--n': fotos.length }"
  >
    <div class="escena">
      <div v-revelar class="cabecera">
        <h2 class="titulo-seccion">Un bello recuerdo</h2>
        <p class="texto-seccion">Pequeños momentos de mi camino de fe</p>
      </div>

      <div v-if="fotos.length" ref="pilaRef" class="pila" role="group" aria-label="Fotos">
        <button
          v-for="(foto, i) in fotos"
          :key="foto.src"
          :ref="(el) => (tarjetas[i] = el as HTMLElement | null)"
          type="button"
          class="polaroid"
          :class="{ ampliada: ampliada === i, animando }"
          :aria-label="ampliada === i ? 'Cerrar foto' : `Ver más grande: ${foto.alt}`"
          @click="tocar(i)"
        >
          <img :src="foto.src" :alt="foto.alt" loading="lazy" />
          <span class="pie">{{ foto.pie }}</span>
        </button>
      </div>

      <p v-if="fotos.length > 1" class="ayuda" :class="{ visible: repartidas }">Toca una foto para verla más grande</p>
      <p v-if="!fotos.length" class="texto-seccion pronto">Muy pronto compartiré aquí mis fotos.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { datos } from "@/datos";
import { usarProgresoPista } from "@/progresoPista";

/*
  Fotos: src/assets/images/sofia1.webp, sofia2.webp, … (o gal1, gal2, …)
  en orden por número. Se ven completas en formato vertical 4:5.
*/
const archivos = import.meta.glob<string>("../assets/images/{sofia,gal}[0-9]*.{webp,jpg,jpeg,png}", {
  eager: true,
  query: "?url",
  import: "default",
});
const numero = (ruta: string) => Number(ruta.match(/(\d+)\.\w+$/)?.[1] ?? 0);
const fotos = Object.keys(archivos)
  .sort((a, b) => numero(a) - numero(b))
  .map((ruta, i) => {
    const pie = datos.pieFotos[i] ?? "";
    return {
      src: archivos[ruta],
      pie,
      alt: pie ? `${datos.nombre}: ${pie}` : `Recuerdo ${i + 1} de ${datos.nombre}`,
    };
  });

const pistaRef = ref<HTMLElement | null>(null);
const pilaRef = ref<HTMLElement | null>(null);
const tarjetas: (HTMLElement | null)[] = [];
const ampliada = ref<number | null>(null);
const animando = ref(false);
const repartidas = ref(false);

/* ---------- dónde está cada foto: en la pila y repartida ---------- */
type Pose = { x: number; y: number; giro: number; escala: number };
const GIROS = [-6, 5, -3, 7, -5, 4];
let enPila: Pose[] = [];
let enMesa: Pose[] = [];
let escalaGrande = 1;
let anchoFoto = 240;
let ultimoP = 0;

function medir() {
  const pila = pilaRef.value;
  if (!pila) return;
  const w = pila.clientWidth;
  const h = pila.clientHeight;
  const n = fotos.length;

  // proporción real de la polaroid (foto 4:5 + marco + pie), medida en pantalla
  const muestra = tarjetas[0];
  const proporcion = muestra && muestra.offsetWidth ? muestra.offsetHeight / muestra.offsetWidth : 1.5;

  // tamaño de la polaroid apilada: que quepa en la mesa
  anchoFoto = Math.min(240, w * 0.66, (h * 0.96) / proporcion);
  const altoFoto = anchoFoto * proporcion;
  pila.style.setProperty("--ancho", `${anchoFoto}px`);

  // repartidas en filas de 2 (la última va sola y centrada si son impares)
  const filas = Math.ceil(n / 2);
  const celdaAncho = w / 2;
  const celdaAlto = h / filas;
  // un poco menos que la celda: así, aun giradas, no tocan los bordes
  const escala = Math.min(1, (celdaAncho * 0.9) / anchoFoto, (celdaAlto * 0.96) / altoFoto);

  enPila = fotos.map((_, i) => ({
    x: 0,
    y: Math.min(i, 3) * 4,
    giro: GIROS[i % GIROS.length] * (i === 0 ? 0.4 : 0.8),
    escala: 1,
  }));

  enMesa = fotos.map((_, i) => {
    const fila = Math.floor(i / 2);
    const enFila = fila === filas - 1 && n % 2 === 1 ? 1 : 2;
    const col = i % 2;
    const x = enFila === 1 ? 0 : (col - 0.5) * celdaAncho;
    const y = (fila - (filas - 1) / 2) * celdaAlto;
    return {
      x: x + (((i * 29) % 9) - 4) * 2,
      y: y + (((i * 17) % 7) - 3) * 2,
      giro: GIROS[i % GIROS.length],
      escala,
    };
  });

  // en grande: que quepa en la mesa
  escalaGrande = Math.min(1.25, (w * 0.92) / anchoFoto, (h * 0.96) / altoFoto);
}

/* ---------- pintar un cuadro según el progreso p (0 → 1) ---------- */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const suave = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function pintar(p: number) {
  const n = fotos.length;
  if (!n || !enMesa.length) return;
  const tramo = 0.85 / n;

  fotos.forEach((_, i) => {
    const el = tarjetas[i];
    if (!el) return;

    if (ampliada.value === i) {
      el.style.transform = `translate3d(0, 0, 0) rotate(0deg) scale(${escalaGrande})`;
      el.style.zIndex = "100";
      return;
    }

    // cada foto sale un poco después que la anterior (se solapan)
    const t = n === 1 ? 1 : Math.min(1, Math.max(0, (p - 0.04 - i * tramo) / (tramo * 1.6)));
    const e = suave(t);
    const vuelo = Math.sin(Math.PI * e); // 0 en la pila y en la mesa, 1 a mitad de camino
    const a = enPila[i];
    const b = enMesa[i];

    const x = lerp(a.x, b.x, e);
    const y = lerp(a.y, b.y, e) - vuelo * 40; // se levanta un poco al volar
    const giro = lerp(a.giro, b.giro, e);
    const escala = lerp(a.escala, b.escala, e) * (1 + vuelo * 0.08);
    const inclinaX = vuelo * 16; // se inclina en 3D mientras vuela
    const inclinaY = vuelo * (b.x >= 0 ? -18 : 18);

    el.style.transform =
      `perspective(900px) translate3d(${x}px, ${y}px, 0) ` +
      `rotateX(${inclinaX}deg) rotateY(${inclinaY}deg) rotate(${giro}deg) scale(${escala})`;
    // las que ya salieron quedan encima; las que esperan, en orden de pila
    el.style.zIndex = String(t > 0 ? 10 + i : n - i);
  });

  repartidas.value = p > 0.97;
}

const { forzar } = usarProgresoPista(pistaRef, (p) => {
  // si sigues bajando con una foto en grande, se vuelve a su sitio
  if (ampliada.value !== null && Math.abs(p - ultimoP) > 0.02 && p < 1) cerrarAmpliada();
  ultimoP = p;
  pintar(p);
});

/* ---------- tocar una foto ---------- */
let temporizador: ReturnType<typeof setTimeout> | undefined;
function conTransicion() {
  animando.value = true;
  clearTimeout(temporizador);
  temporizador = setTimeout(() => (animando.value = false), 550);
}

function cerrarAmpliada() {
  conTransicion();
  ampliada.value = null;
  pintar(ultimoP);
}

function tocar(i: number) {
  conTransicion();
  ampliada.value = ampliada.value === i ? null : i;
  pintar(ultimoP);
}

/* ---------- montaje ---------- */
const movimientoReducido = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function alRedimensionar() {
  medir();
  // sin movimiento: las fotos aparecen ya repartidas
  if (movimientoReducido()) ultimoP = 1;
  pintar(ultimoP);
  forzar();
}

onMounted(() => {
  alRedimensionar();
  window.addEventListener("resize", alRedimensionar);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", alRedimensionar);
  clearTimeout(temporizador);
});
</script>

<style scoped>
/*
  PISTA: con 2 o más fotos, la sección es alta y la escena se queda fija
  mientras bajas: 100svh de escena + 38svh de recorrido por foto.
*/
.recuerdos.con-pista {
  height: calc(100vh + var(--n) * 38vh);
  height: calc(100svh + var(--n) * 38svh);
}

.escena {
  display: flex;
  flex-direction: column;
  padding: var(--espacio-seccion) 22px 30px;
  text-align: center;
}

.con-pista .escena {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
}

/* la mesa donde caen las fotos */
.pila {
  --ancho: 240px; /* lo ajusta medir() según el espacio */
  position: relative;
  flex: 1;
  min-height: 300px;
  margin-top: 20px;
}

.polaroid {
  /* centrada en la mesa, sea cual sea su alto */
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  width: var(--ancho);
  height: fit-content;
  margin: auto;
  padding: 10px 10px 0;
  border: 0;
  background: #fffefb;
  box-shadow: 0 14px 26px -12px rgba(110, 70, 60, 0.45);
  cursor: pointer;
  transform-origin: 50% 50%;
  will-change: transform;
  -webkit-tap-highlight-color: transparent;
}

/* solo al tocar (abrir/cerrar en grande): al bajar, el movimiento va pegado al dedo */
.polaroid.animando {
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.polaroid.ampliada {
  box-shadow: 0 30px 60px -20px rgba(110, 70, 60, 0.55);
}

.polaroid img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  background: var(--rosa);
}

.pie {
  display: block;
  padding: 8px 0;
  font-family: var(--fuente-cursiva);
  font-size: 1.6rem;
  line-height: 1.3;
  color: var(--oro);
}

/* sin frase: el pie conserva su alto, como una polaroid en blanco */
.pie:empty::before {
  content: "\00a0";
}

.ayuda {
  margin: 14px 0 0;
  font-size: 0.95rem;
  font-style: italic;
  color: var(--tinta);
  opacity: 0;
  transition: opacity 0.6s ease;
}

.ayuda.visible {
  opacity: 1;
}

.pronto {
  margin-top: 20px;
  font-style: italic;
}

@media (prefers-reduced-motion: reduce) {
  .recuerdos.con-pista {
    height: auto;
  }
  .con-pista .escena {
    position: relative;
    height: 100svh;
  }
  .ayuda {
    opacity: 1;
  }
}
</style>
