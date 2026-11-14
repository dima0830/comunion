<template>
  <!-- ORACIÓN: las palabras se iluminan una a una mientras bajas -->
  <section ref="seccionRef" class="oracion panel">
    <div class="contenido">
      <p class="antetitulo">Mi oración</p>
      <p class="texto" :aria-label="texto.replace(/\*/g, '')">
        <span
          v-for="(p, i) in palabras"
          :key="i"
          class="palabra"
          :class="{ encendida: i < encendidas, dorada: p.dorada }"
          aria-hidden="true"
        >{{ p.texto }}</span>
      </p>
      <p class="firma">{{ datos.nombre }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { datos } from "@/datos";

/* Las palabras entre *asteriscos* se iluminan en dorado */
const texto =
  "Jesús, hoy abro mi *corazón* para recibirte por primera vez. Que tu *amor* me acompañe siempre: en mi *familia*, en mis amigos y en cada paso de mi *camino*.";

const palabras = texto.split(" ").map((t) => ({
  texto: t.replace(/\*/g, ""),
  dorada: t.includes("*"),
}));

const seccionRef = ref<HTMLElement | null>(null);
const encendidas = ref(0);
let pendiente = false;

/* Progreso: empieza cuando la sección entra por abajo y termina al llegar al centro */
function calcular() {
  pendiente = false;
  const el = seccionRef.value;
  if (!el) return;
  const r = el.getBoundingClientRect();
  const alto = window.innerHeight;
  const progreso = (alto * 0.9 - r.top) / (r.height * 0.75);
  encendidas.value = Math.round(Math.min(1, Math.max(0, progreso)) * palabras.length);
}

function alDesplazar() {
  if (!pendiente) {
    pendiente = true;
    requestAnimationFrame(calcular);
  }
}

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    encendidas.value = palabras.length;
    return;
  }
  window.addEventListener("scroll", alDesplazar, { passive: true });
  calcular();
});

onBeforeUnmount(() => window.removeEventListener("scroll", alDesplazar));
</script>

<style scoped>
.oracion {
  padding: var(--espacio-seccion) 30px;
}

.contenido {
  max-width: 360px;
  margin: 0 auto;
  text-align: center;
}

.texto {
  margin: 0;
  font-family: var(--fuente-titulo);
  font-size: 2rem;
  font-weight: 500;
  line-height: 1.25;
}

.palabra {
  display: inline-block;
  margin-right: 0.26em;
  color: #e8d6cf; /* apagada */
  transition: color 0.4s ease;
}

.palabra.encendida {
  color: var(--titulo);
}

.palabra.dorada.encendida {
  color: var(--oro);
  font-style: italic;
}

.firma {
  margin: 26px 0 0;
  font-family: var(--fuente-cursiva);
  font-size: 2.2rem;
  color: var(--oro);
}
</style>
