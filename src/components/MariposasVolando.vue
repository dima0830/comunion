<template>
  <!-- Mariposas que cruzan volando, aleteando; y destellos dorados que titilan -->
  <div class="cielo" aria-hidden="true">
    <span v-for="d in destellos" :key="'d' + d.id" class="destello" :style="d.estilo"></span>

    <div v-for="m in mariposas" :key="m.id" class="ruta" :style="m.estilo">
      <svg class="mariposa" viewBox="0 0 40 32">
        <g class="ala izquierda">
          <path d="M20 16C14 4 3 0 2 7c-1 6 7 9 18 9z" :fill="m.color" />
          <path d="M20 17C11 17 4 21 7 27c3 5 10-1 13-10z" :fill="m.color2" />
        </g>
        <g class="ala derecha">
          <path d="M20 16C26 4 37 0 38 7c1 6-7 9-18 9z" :fill="m.color" />
          <path d="M20 17c9 0 16 4 13 10-3 5-10-1-13-10z" :fill="m.color2" />
        </g>
        <path d="M20 9v16" stroke="#8a6a3a" stroke-width="1.4" stroke-linecap="round" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ cantidad?: number }>(), { cantidad: 4 });

const colores = [
  ["#e2a898", "#f4d6cb"], // oro rosa
  ["#e3c27c", "#f4e2b5"], // dorado
  ["#d39586", "#efcabd"],
  ["#ecc9a0", "#f7e3cc"],
];

/* Cada mariposa sigue un recorrido distinto, con su propio ritmo */
const mariposas = Array.from({ length: props.cantidad }, (_, id) => {
  const [color, color2] = colores[id % colores.length];
  return {
    id,
    color,
    color2,
    estilo: {
      top: `${10 + ((id * 23) % 70)}%`,
      animationDuration: `${16 + id * 3.5}s`,
      animationDelay: `${-id * 5.3}s`,
      "--escala": 0.6 + ((id * 37) % 5) / 10,
      "--direccion": id % 2 ? -1 : 1,
    },
  };
});

const destellos = Array.from({ length: 16 }, (_, id) => ({
  id,
  estilo: {
    left: `${(id * 61) % 100}%`,
    top: `${(id * 37) % 100}%`,
    animationDelay: `${(id * 0.47) % 4}s`,
    animationDuration: `${2.5 + (id % 4) * 0.7}s`,
  },
}));
</script>

<style scoped>
.cielo {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
}

/* recorrido: cruza la pantalla ondulando */
.ruta {
  position: absolute;
  left: 0;
  width: 34px;
  animation: cruzar linear infinite;
  transform-origin: center;
}

.ruta:nth-child(even) {
  animation-name: cruzarVuelta;
}

.mariposa {
  display: block;
  width: 100%;
  scale: var(--escala);
  filter: drop-shadow(0 2px 3px rgba(150, 90, 80, 0.25));
  animation: flotar 1.6s ease-in-out infinite alternate;
}

/* aleteo: cada ala se cierra sobre el cuerpo */
.ala {
  transform-box: view-box;
  transform-origin: 20px 16px;
  animation: aletear 0.32s ease-in-out infinite alternate;
}

@keyframes aletear {
  to {
    transform: scaleX(0.25);
  }
}

@keyframes flotar {
  to {
    translate: 0 -10px;
    rotate: 8deg;
  }
}

@keyframes cruzar {
  0% { transform: translate(-60px, 0) rotate(10deg); }
  25% { transform: translate(25vw, -40px) rotate(-6deg); }
  50% { transform: translate(min(60vw, 260px), 20px) rotate(12deg); }
  75% { transform: translate(min(85vw, 380px), -30px) rotate(-4deg); }
  100% { transform: translate(min(110vw, 540px), 10px) rotate(8deg); }
}

@keyframes cruzarVuelta {
  0% { transform: translate(min(110vw, 540px), 0) scaleX(-1); }
  30% { transform: translate(min(70vw, 330px), 35px) scaleX(-1) rotate(-8deg); }
  60% { transform: translate(30vw, -25px) scaleX(-1) rotate(6deg); }
  100% { transform: translate(-60px, 15px) scaleX(-1); }
}

/* destellos dorados */
.destello {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #fff6dc;
  box-shadow: 0 0 6px 2px rgba(230, 200, 130, 0.8);
  animation: titilar ease-in-out infinite;
}

@keyframes titilar {
  0%, 100% { opacity: 0; transform: scale(0.4); }
  50% { opacity: 1; transform: scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .ruta,
  .mariposa,
  .ala,
  .destello {
    animation: none;
  }
  .ruta {
    display: none;
  }
}
</style>
