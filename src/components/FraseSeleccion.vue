<template>
  <!--
    FRASE CON SELECCIÓN: al pasar el cursor (o tocar) una palabra destacada,
    un marco dorado con esquineros se desliza hasta ella, una etiqueta muestra
    un dato, y su ícono se rellena de color desde el borde por donde entró el
    cursor. Si nadie interactúa, el marco recorre las palabras solo.
  -->
  <div ref="contenedorRef" class="frase" @pointerleave="alSalir">
    <p class="texto">
      <template v-for="(parte, i) in partes" :key="i">
        <span v-if="typeof parte === 'string'" class="suelto">{{ parte }}</span>
        <span
          v-else
          :ref="(el) => (itemsRef[parte.indice] = el as HTMLElement | null)"
          class="item"
          :class="{ activo: activo === parte.indice }"
          :style="activo === parte.indice ? { '--ox': origen.x, '--oy': origen.y } : undefined"
          tabindex="0"
          @pointerenter="alEntrar(parte.indice, $event)"
          @pointerdown="alEntrar(parte.indice, $event)"
          @focus="seleccionar(parte.indice, 'izquierda')"
        >
          <span class="icono">
            <img v-if="parte.imagen" :src="parte.imagen" alt="" />
            <span v-else-if="parte.inicial" class="inicial">{{ parte.inicial }}</span>
            <svg v-else viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" v-html="parte.icono"></svg>
          </span>
          <span class="palabra">{{ parte.texto }}</span>
        </span>
      </template>
    </p>

    <!-- marco de selección con esquineros y etiqueta -->
    <div class="marco" :class="{ visible: activo !== null }" :style="estiloMarco" aria-hidden="true">
      <i class="esq a"></i><i class="esq b"></i><i class="esq c"></i><i class="esq d"></i>
      <span class="etiqueta">
        <Transition name="etq" mode="out-in">
          <span :key="activo ?? -1">{{ activo !== null ? items[activo].etiqueta : "" }}</span>
        </Transition>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { datos, fechaPartes } from "@/datos";

/* Foto opcional para junto al nombre: src/assets/images/protagonista.* */
const fotos = import.meta.glob<string>("../assets/images/protagonista.{webp,png,jpg}", { eager: true, query: "?url", import: "default" });
const foto = Object.values(fotos)[0] ?? null;

const ICONOS = {
  caliz: '<circle cx="24" cy="10" r="5"/><path d="M12 19h24c0 8-5 13-12 13s-12-5-12-13zM24 32v7M17 43h14"/>',
  iglesia: '<path d="M24 4v8M20 8h8"/><path d="M12 22l12-10 12 10"/><path d="M14 20v22h20V20"/><path d="M21 42v-9a3 3 0 0 1 6 0v9"/>',
  copa: '<path d="M15 6h10l-1 10a4 4 0 0 1-8 0z"/><path d="M20 20v14M15 34h10"/><path d="M28 14h9v6a4.5 4.5 0 0 1-9 0z"/><path d="M32.5 24.5V36M29 36h7"/>',
};

interface Item {
  indice: number;
  texto: string;
  etiqueta: string;
  icono?: string;
  imagen?: string | null;
  inicial?: string;
}

const items: Item[] = [
  { indice: 0, texto: datos.nombre, etiqueta: "¡Esa soy yo!", imagen: foto, inicial: foto ? undefined : datos.nombre[0] },
  { indice: 1, texto: "Primera Comunión", etiqueta: `${fechaPartes.dia} ${fechaPartes.mes} ${fechaPartes.anio}`, icono: ICONOS.caliz },
  { indice: 2, texto: datos.ceremonia.lugar, etiqueta: datos.ceremonia.hora, icono: ICONOS.iglesia },
  { indice: 3, texto: datos.recepcion.lugar, etiqueta: datos.recepcion.hora, icono: ICONOS.copa },
];

/* La frase, con las palabras seleccionables en su lugar */
const partes: (string | Item)[] = [
  "Hola, soy ", items[0], ". Te invito a mi ", items[1], " en la ", items[2], " y a celebrar después en ", items[3], ".",
];

const contenedorRef = ref<HTMLElement | null>(null);
const itemsRef: (HTMLElement | null)[] = [];
const activo = ref<number | null>(null);
const origen = reactive({ x: "0%", y: "50%" });
const caja = reactive({ x: 0, y: 0, w: 0, h: 0 });

const estiloMarco = computed(() => ({
  transform: `translate(${caja.x}px, ${caja.y}px)`,
  width: `${caja.w}px`,
  height: `${caja.h}px`,
}));

function medir() {
  const cont = contenedorRef.value;
  const el = activo.value !== null ? itemsRef[activo.value] : null;
  if (!cont || !el) return;
  const c = cont.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  caja.x = r.left - c.left - 5;
  caja.y = r.top - c.top - 4;
  caja.w = r.width + 10;
  caja.h = r.height + 8;
}

type Lado = "izquierda" | "derecha" | "arriba" | "abajo";
const ORIGENES: Record<Lado, [string, string]> = {
  izquierda: ["0%", "50%"],
  derecha: ["100%", "50%"],
  arriba: ["50%", "0%"],
  abajo: ["50%", "100%"],
};

function seleccionar(i: number, lado: Lado) {
  [origen.x, origen.y] = ORIGENES[lado];
  activo.value = i;
  medir();
}

/* ¿Por qué borde entró el cursor? El más cercano al punto de entrada */
function alEntrar(i: number, e: PointerEvent) {
  pausarAuto();
  const el = itemsRef[i];
  if (!el) return;
  const r = el.getBoundingClientRect();
  const distancias: [Lado, number][] = [
    ["izquierda", e.clientX - r.left],
    ["derecha", r.right - e.clientX],
    ["arriba", (e.clientY - r.top) * 2.5],
    ["abajo", (r.bottom - e.clientY) * 2.5],
  ];
  distancias.sort((a, b) => a[1] - b[1]);
  seleccionar(i, distancias[0][0]);
}

function alSalir() {
  reanudarAuto();
}

/* Recorrido automático (en el celular y mientras nadie pasa el cursor) */
let auto: ReturnType<typeof setInterval> | undefined;
let espera: ReturnType<typeof setTimeout> | undefined;
const LADOS: Lado[] = ["izquierda", "arriba", "derecha", "abajo"];

function siguienteAuto() {
  const i = activo.value === null ? 0 : (activo.value + 1) % items.length;
  seleccionar(i, LADOS[i % LADOS.length]);
}

function pausarAuto() {
  clearInterval(auto);
  clearTimeout(espera);
}

function reanudarAuto() {
  pausarAuto();
  espera = setTimeout(() => {
    siguienteAuto();
    auto = setInterval(siguienteAuto, 2600);
  }, 3000);
}

let observador: IntersectionObserver | undefined;

onMounted(() => {
  window.addEventListener("resize", medir);
  document.fonts?.ready.then(medir);
  // empieza a recorrer cuando la frase aparece en pantalla
  observador = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      reanudarAuto();
      observador?.disconnect();
    }
  }, { threshold: 0.6 });
  if (contenedorRef.value) observador.observe(contenedorRef.value);
});

onBeforeUnmount(() => {
  pausarAuto();
  observador?.disconnect();
  window.removeEventListener("resize", medir);
});
</script>

<style scoped>
.frase {
  position: relative;
  max-width: 360px;
  margin: 0 auto;
  text-align: center;
}

.texto {
  margin: 0;
  font-family: var(--fuente-titulo);
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1.75;
  color: #b9a49b; /* el texto suelto, apagado */
}

.item {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--titulo);
  font-weight: 700;
  white-space: nowrap;
  cursor: default;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

/* ÍCONO que se rellena desde el borde de entrada */
.icono {
  position: relative;
  display: inline-grid;
  place-items: center;
  width: 1.25em;
  height: 1.25em;
  padding: 0.18em;
  border: 1px solid var(--oro-rosa-claro);
  border-radius: 0.3em;
  overflow: hidden;
  color: var(--oro-rosa);
  vertical-align: middle;
  transition: color 0.35s ease;
}

.icono::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--metal-rosa);
  clip-path: circle(0% at var(--ox, 0%) var(--oy, 50%));
  transition: clip-path 0.55s cubic-bezier(0.65, 0, 0.35, 1);
}

.item.activo .icono {
  color: #fff;
}

.item.activo .icono::before {
  clip-path: circle(150% at var(--ox, 0%) var(--oy, 50%));
}

.icono svg,
.icono img,
.inicial {
  position: relative;
  width: 100%;
  height: 100%;
}

.icono img {
  object-fit: cover;
  border-radius: 0.2em;
}

/* con foto o inicial el ícono es redondo */
.icono:has(img),
.icono:has(.inicial) {
  border-radius: 50%;
}

.inicial {
  display: grid;
  place-items: center;
  font-family: var(--fuente-cursiva);
  font-size: 0.85em;
  line-height: 1;
}

/* MARCO DE SELECCIÓN */
.marco {
  position: absolute;
  top: 0;
  left: 0;
  border: 1.5px solid var(--oro-rosa);
  border-radius: 3px;
  pointer-events: none;
  opacity: 0;
  transition:
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    width 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    height 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s ease;
}

.marco.visible {
  opacity: 1;
}

/* esquineros cuadrados */
.esq {
  position: absolute;
  width: 7px;
  height: 7px;
  border: 1.5px solid var(--oro-rosa);
  background: var(--tarjeta);
}
.esq.a { top: -4px; left: -4px; }
.esq.b { top: -4px; right: -4px; }
.esq.c { bottom: -4px; left: -4px; }
.esq.d { bottom: -4px; right: -4px; }

/* etiqueta con el dato, debajo del marco */
.etiqueta {
  position: absolute;
  top: calc(100% + 6px);
  left: 50%;
  translate: -50% 0;
  padding: 2px 9px;
  border-radius: 4px;
  background: var(--metal-rosa);
  color: #fff;
  font-family: var(--fuente-mayus);
  font-size: 0.66rem;
  letter-spacing: 1px;
  white-space: nowrap;
  box-shadow: 0 3px 8px -3px rgba(150, 80, 65, 0.6);
}

.etq-enter-active,
.etq-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}
.etq-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.etq-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .marco,
  .icono::before {
    transition: opacity 0.2s ease;
  }
}
</style>
