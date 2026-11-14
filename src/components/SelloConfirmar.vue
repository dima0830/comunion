<template>
  <!--
    Sello redondo con texto que gira y una flecha al centro: lleva a la
    confirmación. Aparece después de la portada y se oculta al llegar a ella.
  -->
  <Transition name="sello">
    <a v-if="visible" href="#confirmar" class="sello-confirmar" aria-label="Ir a confirmar asistencia">
      <svg class="anillo" viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <path id="circulo-texto" d="M50 50m-37 0a37 37 0 1 1 74 0a37 37 0 1 1-74 0" />
        </defs>
        <text>
          <textPath href="#circulo-texto" textLength="226">CONFIRMA ✦ TU ASISTENCIA ✦</textPath>
        </text>
      </svg>
      <svg class="flecha" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 5v14M19 12l-7 7-7-7" />
      </svg>
    </a>
  </Transition>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const visible = ref(false);
let pasoPortada = false;
let enConfirmar = false;
const observadores: IntersectionObserver[] = [];

function actualizar() {
  visible.value = pasoPortada && !enConfirmar;
}

onMounted(() => {
  const portada = document.querySelector("#inicio");
  const confirmar = document.querySelector("#confirmar");
  if (portada) {
    const o = new IntersectionObserver(([e]) => {
      pasoPortada = !e.isIntersecting;
      actualizar();
    });
    o.observe(portada);
    observadores.push(o);
  }
  if (confirmar) {
    // oculto mientras se ve la confirmación y también después de pasarla
    const o = new IntersectionObserver(([e]) => {
      enConfirmar = e.isIntersecting || e.boundingClientRect.top < 0;
      actualizar();
    });
    o.observe(confirmar);
    observadores.push(o);
  }
});

onBeforeUnmount(() => observadores.forEach((o) => o.disconnect()));
</script>

<style scoped>
.sello-confirmar {
  position: fixed;
  /* esquina inferior izquierda de la invitación (el botón de música va a la derecha) */
  left: max(14px, calc(50% - 240px + 14px));
  bottom: 18px;
  z-index: 20;
  display: grid;
  place-items: center;
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #f6d9cd, #cf9585 55%, #a8695c);
  color: #fff;
  text-decoration: none;
  box-shadow: 0 8px 20px -6px rgba(140, 70, 55, 0.55);
}

.anillo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  animation: girar 12s linear infinite;
}

.anillo text {
  font-family: var(--fuente-mayus);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  fill: #fff;
}

.flecha {
  width: 22px;
  height: 22px;
  animation: bajar 1.8s ease-in-out infinite;
}

@keyframes girar {
  to {
    rotate: 360deg;
  }
}

@keyframes bajar {
  50% {
    transform: translateY(3px);
  }
}

.sello-enter-active,
.sello-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.sello-enter-from,
.sello-leave-to {
  opacity: 0;
  transform: scale(0.5) rotate(-40deg);
}

@media (prefers-reduced-motion: reduce) {
  .anillo,
  .flecha {
    animation: none;
  }
}
</style>
