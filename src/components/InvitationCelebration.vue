<template>
  <!-- FALTAN -->
  <section class="seccion faltan panel">
    <div v-revelar>
      <h2 class="titulo-seccion">Faltan</h2>
      <CountdownTimer :event-date="eventDate" />
    </div>
    <svg class="corazon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="currentColor"
      />
    </svg>
  </section>

  <GuirnaldaFlores tipo="divisor" />

  <!-- CELEBRACIÓN: tarjeta flotante sobre el video de fondo -->
  <section class="celebracion">

    <div v-revelar class="tarjeta tarjeta-evento">
      <!-- Ilustración: cáliz dorado con la hostia y rayos de luz -->
      <svg class="anillos" viewBox="0 0 120 80" aria-hidden="true">
        <defs>
          <linearGradient id="oro-caliz" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#e6cf98" />
            <stop offset="0.5" stop-color="#b8955a" />
            <stop offset="1" stop-color="#8c6d32" />
          </linearGradient>
        </defs>
        <g stroke="#d8c29a" stroke-width="1.5" stroke-linecap="round">
          <path d="M60 2v6M44 6l3 5M76 6l-3 5M34 15l5 3M86 15l-5 3" />
        </g>
        <circle cx="60" cy="22" r="9" fill="#fdfbf7" stroke="url(#oro-caliz)" stroke-width="2" />
        <path d="M56 22h8M60 18v8" stroke="#c9a45c" stroke-width="1.6" stroke-linecap="round" />
        <path d="M40 33h40c0 11-8.5 18-20 18s-20-7-20-18z" fill="url(#oro-caliz)" />
        <path d="M58 51h4v12h-4z" fill="url(#oro-caliz)" />
        <path d="M47 76c0-7 6-12 13-12s13 5 13 12z" fill="url(#oro-caliz)" />
      </svg>

      <h2 class="titulo-mayus">{{ datos.ceremonia.titulo.toUpperCase() }}</h2>
      <span class="filete" aria-hidden="true"></span>
      <p class="mes">{{ fechaPartes.mes }}</p>

      <div class="fila-fecha">
        <span class="lado">{{ fechaPartes.diaSemana }}</span>
        <span class="dia">{{ fechaPartes.dia }}</span>
        <span class="lado">{{ datos.ceremonia.hora }}</span>
      </div>
      <p class="anio">{{ fechaPartes.anio }}</p>

      <p class="lugar">{{ datos.ceremonia.lugar }}</p>
      <a :href="datos.ceremonia.mapa" target="_blank" rel="noopener noreferrer" class="btn-verde">
        ¿Cómo llegar?
      </a>

      <!-- Recepción después de la misa -->
      <div class="recepcion">
        <span class="filete" aria-hidden="true"></span>
        <p class="titulo-mayus recepcion-titulo">{{ datos.recepcion.titulo.toUpperCase() }}</p>
        <p class="recepcion-hora">{{ datos.recepcion.hora }}</p>
        <p class="lugar">{{ datos.recepcion.lugar }}</p>
        <a :href="datos.recepcion.mapa" target="_blank" rel="noopener noreferrer" class="btn-verde">
          ¿Cómo llegar?
        </a>
      </div>
    </div>

  </section>

  <GuirnaldaFlores tipo="divisor" />
</template>

<script setup lang="ts">
import { datos, fechaPartes } from "@/datos";
import CountdownTimer from "@/components/CountdownTimer.vue";
import GuirnaldaFlores from "@/components/GuirnaldaFlores.vue";

defineProps<{
  eventDate: string;
}>();

</script>

<style scoped>
.faltan {
  padding-top: 20px;
  padding-bottom: 100px;
}

.corazon {
  display: block;
  width: 26px;
  height: 26px;
  margin: 16px auto 0;
  color: var(--oro);
  animation: latir 2.2s ease-in-out infinite;
}

@keyframes latir {
  0%,
  100% {
    transform: scale(1);
  }
  15% {
    transform: scale(1.18);
  }
  30% {
    transform: scale(1);
  }
  45% {
    transform: scale(1.12);
  }
}

/* Transparente: la tarjeta flota sobre el video de fondo */
.celebracion {
  position: relative;
  overflow: hidden;
}

.tarjeta-evento {
  z-index: 2;
  /* angosta y centrada: a los lados se ve el video de fondo */
  width: min(calc(100% - 48px), 300px);
  margin: 110px auto;
  padding-top: 22px;
}

.anillos {
  display: block;
  width: 110px;
  height: auto;
  margin: 0 auto 6px;
}

.filete {
  display: block;
  width: 70%;
  height: 1px;
  margin: 8px auto 10px;
  background: var(--linea);
}

.mes {
  margin: 0 0 6px;
  font-family: var(--fuente-mayus);
  font-size: 0.85rem;
  letter-spacing: 2px;
  color: var(--oro);
}

.fila-fecha {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 10px;
}

.lado {
  padding: 5px 0;
  border-block: 1px solid var(--oro-claro);
  font-family: var(--fuente-mayus);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1.2px;
  color: var(--titulo);
}

.dia {
  font-family: var(--fuente-titulo);
  font-size: 3.4rem;
  font-weight: 600;
  line-height: 1;
  color: var(--verde-oscuro);
}

.anio {
  margin: 2px 0 14px;
  font-family: var(--fuente-mayus);
  font-size: 0.8rem;
  letter-spacing: 2px;
  color: var(--titulo);
}

.lugar {
  margin: 0;
  font-size: 1.1rem;
  font-style: italic;
  color: var(--tinta);
}

.recepcion {
  width: 100%;
  margin-top: 26px;
}

.recepcion .filete {
  margin-bottom: 18px;
}

.recepcion-titulo {
  margin: 0;
  font-size: 1rem;
}

.recepcion-hora {
  margin: 6px 0 0;
  font-family: var(--fuente-mayus);
  font-size: 1.1rem;
  letter-spacing: 2px;
  color: var(--oro);
}
</style>
