<template>
  <!-- Rosas creciendo desde el borde inferior de la sección que la contiene
       (esa sección necesita position: relative) -->
  <img :src="abajo" alt="" class="flores borde abajo" aria-hidden="true" />
</template>

<script setup lang="ts">
import abajo from "@/assets/images/guirnalda-abajo.webp";
</script>

<style scoped>
.flores {
  display: block;
  /* un poco más ancha que la invitación: las flores salen por los lados */
  width: max(108%, 520px);
  max-width: none;
  height: auto;
  pointer-events: none;
  user-select: none;
  filter: drop-shadow(0 6px 10px rgba(40, 32, 20, 0.18));
}

.divisor {
  position: relative;
  z-index: 5;
  height: 0;
}

.divisor .flores {
  position: absolute;
  top: 0;
  left: 50%;
  translate: -50% -50%;
  animation: mecer 9s ease-in-out infinite;
}

.borde {
  position: absolute;
  left: 50%;
  z-index: 3;
  translate: -50% 0;
  animation: mecer 10s ease-in-out infinite;
}

.borde.arriba {
  top: -2px;
  transform-origin: 50% 0;
}

.borde.abajo {
  bottom: -2px;
  transform-origin: 50% 100%;
  animation-direction: reverse;
}

/* se mecen muy suavemente, como movidas por la brisa */
@keyframes mecer {
  0%,
  100% {
    rotate: -0.4deg;
    scale: 1;
  }
  50% {
    rotate: 0.4deg;
    scale: 1.025;
  }
}

@media (prefers-reduced-motion: reduce) {
  .flores {
    animation: none !important;
  }
}
</style>
