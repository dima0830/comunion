<template>
  <!-- Cuenta regresiva en cuatro arquitos; cada número cambia girando -->
  <div v-if="!terminado" class="cuenta" role="timer" aria-live="off">
    <div v-for="u in unidades" :key="u.etiqueta" class="unidad">
      <Transition name="giro" mode="out-in">
        <span :key="u.valor" class="numero">{{ u.valor }}</span>
      </Transition>
      <span class="etiqueta">{{ u.etiqueta }}</span>
    </div>
  </div>
  <p v-else class="hoy">¡Hoy es el gran día!</p>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps<{ fecha: string }>();
const ahora = ref(Date.now());
let reloj: ReturnType<typeof setInterval> | undefined;

onMounted(() => (reloj = setInterval(() => (ahora.value = Date.now()), 1000)));
onBeforeUnmount(() => clearInterval(reloj));

const restante = computed(() => Math.max(0, new Date(props.fecha).getTime() - ahora.value));
const terminado = computed(() => restante.value === 0);

const unidades = computed(() => {
  const s = Math.floor(restante.value / 1000);
  const dos = (n: number) => String(n).padStart(2, "0");
  return [
    { etiqueta: "Días", valor: String(Math.floor(s / 86400)) },
    { etiqueta: "Horas", valor: dos(Math.floor((s % 86400) / 3600)) },
    { etiqueta: "Min", valor: dos(Math.floor((s % 3600) / 60)) },
    { etiqueta: "Seg", valor: dos(s % 60) },
  ];
});
</script>

<style scoped>
/* cuenta regresiva en una línea: números grandes separados por puntos */
.cuenta {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 4px;
}

.unidad {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 70px;
  perspective: 300px;
}

/* punto separador entre unidades */
.unidad + .unidad::before {
  content: "";
  position: absolute;
  left: -4px;
  top: 18px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--oro-rosa);
}

.numero {
  display: block;
  font-family: var(--fuente-titulo);
  font-size: 2.6rem;
  line-height: 1;
  color: var(--titulo);
}

.etiqueta {
  margin-top: 6px;
  font-family: var(--fuente-mayus);
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--oro-rosa);
}

/* el número sale girando hacia arriba y entra el nuevo desde abajo */
.giro-enter-active,
.giro-leave-active {
  transition:
    transform 0.14s ease,
    opacity 0.14s ease;
}
.giro-enter-from {
  transform: rotateX(-90deg);
  opacity: 0;
}
.giro-leave-to {
  transform: rotateX(90deg);
  opacity: 0;
}

.hoy {
  margin: 0;
  font-family: var(--fuente-cursiva);
  font-size: 2.4rem;
  color: var(--oro);
}
</style>
