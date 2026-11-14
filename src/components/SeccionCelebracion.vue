<template>
  <!--
    ACOMPÁÑAME, estilo editorial: la fecha enorme en dorado con la capilla,
    cuenta regresiva en línea, y la misa y la recepción en dos tarjetas.
  -->
  <section id="fecha" class="celebracion">
    <div v-revelar class="cabecera">
      <p class="antetitulo">Acompáñame el</p>

      <!-- FECHA: composición tipográfica con la capilla -->
      <div v-paralaje class="fecha">
        <span class="dia-semana">{{ fechaPartes.diaSemana }}</span>
        <span class="dia metal">{{ fechaPartes.dia }}</span>
        <span class="mes">{{ fechaPartes.mes }} <i>·</i> {{ fechaPartes.anio }}</span>
        <img :src="capilla" alt="Capilla rodeada de rosas" class="capilla" />
      </div>

      <!-- cuenta regresiva en una sola línea -->
      <CuentaArcos :fecha="datos.fecha" class="cuenta" />
    </div>

    <!-- EVENTOS -->
    <div v-revelar class="eventos">
      <!--
        LÍNEA DEL DÍA: una línea dorada une los eventos y se va dibujando al
        bajar (--c viene de v-paralaje); cada punto se enciende al llegarle.
      -->
      <div v-paralaje class="linea-dia" :style="{ '--n': eventos.length }">
      <div v-for="(e, i) in eventos" :key="e.titulo" class="paso" :style="{ '--i': i }">
      <span v-if="i < eventos.length - 1" class="trazo" aria-hidden="true"></span>
      <article class="evento arco">
        <div class="hora">
          <span class="hh">{{ e.horaCorta }}</span>
          <span class="ampm">{{ e.ampm }}</span>
        </div>
        <div class="info">
          <span class="icono" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" v-html="e.icono"></svg>
          </span>
          <h3 class="titulo-evento">{{ e.titulo }}</h3>
          <p class="lugar">{{ e.lugar }}</p>
          <a :href="e.mapa" target="_blank" rel="noopener noreferrer" class="como-llegar">
            Cómo llegar
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
          </a>
        </div>
      </article>
      </div>
      </div>

      <a :href="calendario" target="_blank" rel="noopener noreferrer" class="agendar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3.5" y="5" width="17" height="15" rx="3" />
          <path d="M3.5 10h17M8 3v4M16 3v4M12 13v4M10 15h4" />
        </svg>
        Agendar en mi calendario
      </a>
    </div>

    <!-- frase interactiva (selección que se desliza) -->
    <div v-revelar class="frase-final">
      <FraseSeleccion />
    </div>
  </section>
</template>

<script setup lang="ts">
import { datos, fechaPartes } from "@/datos";
import capilla from "@/assets/images/capilla.webp";

const ICONO_IGLESIA =
  '<path d="M24 4v8M20 8h8"/><path d="M12 22l12-10 12 10"/><path d="M14 20v22h20V20"/><path d="M21 42v-9a3 3 0 0 1 6 0v9"/>';
const ICONO_RECEPCION =
  '<path d="M15 6h10l-1 10a4 4 0 0 1-8 0z"/><path d="M20 20v14M15 34h10"/><path d="M28 14h9v6a4.5 4.5 0 0 1-9 0z"/><path d="M32.5 24.5V36M29 36h7"/>';

/* "10:00 AM" → "10:00" y "AM" */
const partirHora = (h: string) => {
  const [horaCorta, ampm = ""] = h.split(" ");
  return { horaCorta, ampm };
};

const eventos = [
  { ...datos.ceremonia, ...partirHora(datos.ceremonia.hora), icono: ICONO_IGLESIA },
  { ...datos.recepcion, ...partirHora(datos.recepcion.hora), icono: ICONO_RECEPCION },
];

/* Enlace para agregar la misa a Google Calendar (2 horas por defecto) */
const inicio = new Date(datos.fecha);
const fin = new Date(inicio.getTime() + 2 * 3600 * 1000);
const formato = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const calendario =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  `&text=${encodeURIComponent(`Primera Comunión de ${datos.nombre}`)}` +
  `&dates=${formato(inicio)}/${formato(fin)}` +
  `&location=${encodeURIComponent(datos.ceremonia.lugar)}`;
</script>

<style scoped>
.celebracion {
  position: relative;
  padding: var(--espacio-seccion) 22px;
  overflow: hidden;
  background:
    radial-gradient(ellipse 90% 40% at 80% 18%, rgba(236, 199, 186, 0.55), transparent 70%),
    radial-gradient(ellipse 70% 35% at 10% 70%, rgba(233, 204, 142, 0.25), transparent 70%),
    var(--crema);
}

.cabecera {
  text-align: center;
}

/* FECHA */
.fecha {
  position: relative;
  display: grid;
  justify-items: center;
  margin: 6px auto 0;
  max-width: 360px;
}

.dia-semana {
  font-family: var(--fuente-mayus);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 8px;
  color: var(--titulo);
}

.dia {
  position: relative;
  z-index: 1;
  margin: -6px 0 -14px;
  font-family: var(--fuente-titulo);
  font-size: clamp(9rem, 48vw, 12rem);
  line-height: 1;
  /* primer plano: el número va un poco más rápido que la página */
  translate: 0 calc(var(--c, 0) * 28px);
}

.metal {
  background: linear-gradient(180deg, #e3c27c 0%, #b8955a 45%, #cf9585 80%, #b9786a 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.mes {
  font-family: var(--fuente-titulo);
  font-size: 1.6rem;
  letter-spacing: 6px;
  text-transform: uppercase;
  color: var(--titulo);
}

.mes i {
  font-style: normal;
  color: var(--oro-rosa);
}

/* la capilla flota junto al número */
.capilla {
  position: absolute;
  right: -26px;
  top: 4px;
  z-index: 0;
  width: 132px;
  -webkit-mask-image: radial-gradient(circle, #000 50%, transparent 71%);
  mask-image: radial-gradient(circle, #000 50%, transparent 71%);
  animation: flotar 6s ease-in-out infinite alternate;
  /* fondo: la capilla va más lenta que la página y se queda detrás del "16" */
  translate: 0 calc(var(--c, 0) * -110px);
  scale: calc(1 - var(--c, 0) * 0.12);
}

@keyframes flotar {
  to {
    transform: translateY(-10px) rotate(2deg);
  }
}

.cuenta {
  margin-top: 34px;
}

/* EVENTOS: tarjetas horizontales */
.eventos {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 380px;
  margin: 40px auto 0;
}

/*
  LÍNEA DEL DÍA
  --fill (0 → 1): cuánto de la línea está dibujada. Empieza cuando los eventos
  entran por abajo (--c ≈ 0.35) y termina antes de llegar al centro (--c ≈ -0.1).
*/
.linea-dia {
  --fill: clamp(0, (0.35 - var(--c, 0.35)) / 0.45, 1);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.paso {
  /* cuánto le toca a este tramo y si su punto ya se encendió */
  --tramo: clamp(0, var(--fill) * (var(--n) - 1) - var(--i), 1);
  /* (el segundo factor deja apagado el primer punto hasta que la línea arranca) */
  --luz: calc(clamp(0, (var(--fill) * (var(--n) - 1) - var(--i) + 0.07) * 14, 1) * clamp(0, var(--fill) * 20, 1));
  position: relative;
  padding-left: 30px;
}

/* el punto de cada evento, a la altura del centro de su tarjeta */
.paso::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 3px;
  z-index: 2; /* encima del trazo */
  width: 13px;
  height: 13px;
  margin-top: -6.5px;
  border: 1.5px solid var(--oro);
  border-radius: 50%;
  background: color-mix(in srgb, var(--oro) calc(var(--luz) * 100%), var(--crema));
  box-shadow: 0 0 calc(var(--luz) * 12px) rgba(227, 194, 124, calc(var(--luz) * 0.9));
  scale: calc(0.85 + var(--luz) * 0.25);
}

/* el riel tenue hasta el siguiente evento (todos menos el último) */
.paso:not(:last-child)::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 9px;
  width: 1.5px;
  height: calc(100% + 16px);
  background: var(--oro-claro);
  opacity: 0.45;
}

/* el trazo dorado que se dibuja encima del riel */
.trazo {
  position: absolute;
  top: 50%;
  left: 9px;
  z-index: 1;
  width: 1.5px;
  height: calc(100% + 16px);
  background: linear-gradient(180deg, #e3c27c, var(--oro) 60%, #cf9585);
  transform-origin: 50% 0;
  scale: 1 var(--tramo);
}

.evento {
  display: grid;
  grid-template-columns: 88px 1fr;
  align-items: stretch;
  overflow: hidden;
  border-radius: 24px;
  text-align: left;
}

/* columna de la hora, en oro rosa metálico */
.hora {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 18px 6px;
  background: var(--metal-rosa);
  color: #fff;
}

.hh {
  font-family: var(--fuente-titulo);
  font-size: 1.65rem;
  line-height: 1;
}

.ampm {
  margin-top: 4px;
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 3px;
}

.info {
  position: relative;
  padding: 18px 18px 16px;
}

.icono {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 30px;
  height: 30px;
  color: var(--oro);
  opacity: 0.8;
}

.icono svg {
  width: 100%;
  height: 100%;
}

.titulo-evento {
  margin: 0;
  padding-right: 30px;
  font-family: var(--fuente-titulo);
  font-size: clamp(1.05rem, 5vw, 1.25rem);
  white-space: nowrap;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--titulo);
}

.lugar {
  margin: 4px 0 10px;
  font-size: 0.95rem;
  font-weight: 300;
  color: var(--tinta);
}

.como-llegar {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(185, 120, 106, 0.1);
  color: var(--oro-rosa);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.como-llegar:hover {
  background: rgba(185, 120, 106, 0.2);
}

.como-llegar svg {
  width: 14px;
  height: 14px;
}

.agendar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  align-self: center;
  margin-top: 10px;
  padding: 12px 22px;
  border: 1px solid var(--oro-rosa-claro);
  border-radius: 999px;
  color: var(--titulo);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.agendar:hover {
  background: var(--oro-rosa);
  color: #fff;
}

.agendar svg {
  width: 18px;
  height: 18px;
}

.frase-final {
  margin-top: 48px;
}

@media (prefers-reduced-motion: reduce) {
  .capilla {
    animation: none;
  }
}
</style>
