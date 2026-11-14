<template>
  <!-- DETALLES: pestañas con ícono (vestimenta, regalos, canción y notas) -->
  <section id="detalles" class="detalles panel-rosa">
    <div v-revelar class="seccion">
      <h2 class="titulo-seccion">Detalles</h2>
      <p class="texto-seccion">Todo lo que necesitas saber</p>

      <div class="pestanas" role="tablist" aria-label="Detalles de la celebración">
        <button
          v-for="p in pestanas"
          :id="`pestana-${p.id}`"
          :key="p.id"
          type="button"
          role="tab"
          class="pestana"
          :class="{ activa: activa === p.id }"
          :aria-selected="activa === p.id"
          :aria-controls="`panel-${p.id}`"
          @click="activa = p.id"
        >
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="p.icono"></svg>
          <span>{{ p.titulo }}</span>
        </button>
      </div>

      <div class="arco panel-detalle">
        <Transition name="cambio" mode="out-in">
          <!-- VESTIMENTA -->
          <div v-if="activa === 'vestimenta'" id="panel-vestimenta" key="v" role="tabpanel" aria-labelledby="pestana-vestimenta">
            <VideoGiratorio v-if="videoVestimenta" class="video-vestimenta" :src="videoVestimenta" descripcion="Ejemplo de vestimenta elegante en tonos claros" />
            <p class="subtitulo">Elegante</p>
            <p class="texto-seccion">
              Te sugerimos vestir con elegancia, en tonos claros o pastel, para este día tan especial.
            </p>
            <p class="texto-seccion nota">
              Con cariño te pedimos dejar el <strong>blanco</strong> para {{ datos.nombre }}.
            </p>
          </div>

          <!-- REGALOS -->
          <div v-else-if="activa === 'regalos'" id="panel-regalos" key="r" role="tabpanel" aria-labelledby="pestana-regalos">
            <!-- sobre con sello, en línea dorada como los demás íconos -->
            <svg class="icono-panel" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="6" y="13" width="36" height="25" rx="3" />
              <path d="M6.8 14.5L24 27.5l17.2-13" />
              <path d="M24 31.6c-1.6-1.4-3.2-2.5-3.2-4a1.7 1.7 0 0 1 3.2-.8 1.7 1.7 0 0 1 3.2.8c0 1.5-1.6 2.6-3.2 4z" fill="currentColor" stroke="none" />
              <path d="M38 5v4M36 7h4M10 5.5v2.5M8.75 6.75h2.5" stroke-width="1.2" />
            </svg>
            <p class="subtitulo">Lluvia de sobres</p>
            <p class="texto-seccion">
              Tu presencia es mi mejor regalo. Si deseas hacerme un obsequio, habrá una
              <strong>lluvia de sobres</strong> el día de la celebración.
            </p>
          </div>

          <!-- CANCIÓN -->
          <div v-else-if="activa === 'cancion'" id="panel-cancion" key="c" role="tabpanel" aria-labelledby="pestana-cancion">
            <p class="subtitulo">Sugiere una canción</p>
            <p v-if="enviada" class="texto-seccion">
              ¡Gracias! Anotamos <strong>{{ enviadaCancion }}</strong> para la celebración.
            </p>
            <form v-else class="formulario" @submit.prevent="enviar">
              <label class="campo">
                <span class="campo-etiqueta">Tu nombre</span>
                <input v-model="nombre" class="campo-entrada" type="text" autocomplete="name" placeholder="Ingresa tu nombre" required />
              </label>
              <label class="campo">
                <span class="campo-etiqueta">Canción y artista</span>
                <input v-model="cancion" class="campo-entrada" type="text" placeholder="Nombre de la canción y artista" required />
              </label>
              <p v-if="error" class="error">{{ error }}</p>
              <button type="submit" class="btn-verde" :disabled="enviando">
                {{ enviando ? "Enviando..." : "Sugerir canción" }}
              </button>
            </form>
          </div>

          <!-- NOTAS -->
          <div v-else id="panel-notas" key="n" role="tabpanel" aria-labelledby="pestana-notas">
            <p class="subtitulo">Ten en cuenta</p>
            <ul class="lista">
              <li>¡Por favor, sé puntual! La misa empieza a las {{ datos.ceremonia.hora }}.</li>
              <li>Durante la misa te pedimos silenciar el celular y acompañarnos en oración.</li>
              <li>Confirma tu asistencia lo antes posible para preparar todo con cariño.</li>
              <li>Después de la misa nos vemos en {{ datos.recepcion.lugar }}.</li>
            </ul>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { datos } from "@/datos";
import VideoGiratorio from "@/components/VideoGiratorio.vue";

const pestanas = [
  { id: "vestimenta", titulo: "Vestimenta", icono: '<path d="M18 6l-8 5 3 7 4-2v24h14V16l4 2 3-7-8-5c-1 3-3.5 5-6 5s-5-2-6-5z"/>' },
  { id: "regalos", titulo: "Regalos", icono: '<rect x="7" y="18" width="34" height="9" rx="1"/><path d="M10 27v15h28V27M24 18v24"/><path d="M24 18c-3-6-11-7-11-2 0 3 6 2 11 2zM24 18c3-6 11-7 11-2 0 3-6 2-11 2z"/>' },
  { id: "cancion", titulo: "Canción", icono: '<path d="M18 34V12l20-5v22"/><circle cx="13" cy="34" r="5"/><circle cx="33" cy="29" r="5"/>' },
  { id: "notas", titulo: "Notas", icono: '<rect x="11" y="8" width="26" height="34" rx="3"/><path d="M18 8V5h12v3M18 26l4 4 8-9"/>' },
] as const;

type Pestana = (typeof pestanas)[number]["id"];
const activa = ref<Pestana>("vestimenta");

/* Video opcional de vestimenta: src/assets/videos/dresscode.mp4 */
const encontrados = import.meta.glob<string>("../assets/videos/dresscode.{mp4,webm}", {
  eager: true,
  query: "?url",
  import: "default",
});
const videoVestimenta = Object.values(encontrados)[0] ?? null;

/* Sugerir canción */
const nombre = ref("");
const cancion = ref("");
const enviando = ref(false);
const enviada = ref(false);
const enviadaCancion = ref("");
const error = ref("");

async function enviar() {
  error.value = "";
  enviando.value = true;
  try {
    const respuesta = await fetch("/api/canciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: nombre.value.trim(), song: cancion.value.trim() }),
    });
    if (!respuesta.ok) throw new Error();
    enviadaCancion.value = cancion.value.trim();
    enviada.value = true;
  } catch {
    error.value = "No pudimos guardar tu canción. Por favor intenta nuevamente.";
  } finally {
    enviando.value = false;
  }
}
</script>

<style scoped>
.detalles .seccion {
  padding: var(--espacio-seccion) 22px;
}

.pestanas {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin: 30px auto 0;
  max-width: 360px;
}

.pestana {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 4px 10px;
  border: 0;
  border-radius: 16px;
  background: rgba(255, 253, 251, 0.75);
  box-shadow: 0 8px 18px -12px rgba(150, 90, 75, 0.45);
  color: var(--titulo);
  font-family: var(--fuente-mayus);
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    transform 0.3s ease,
    opacity 0.6s ease,
    translate 0.7s cubic-bezier(0.34, 1.4, 0.64, 1);
}

/* ENTRADA: las pestañas aparecen una tras otra, subiendo un poco */
.revelar .pestana {
  opacity: 0;
  translate: 0 14px;
}

.revelar.visible .pestana {
  opacity: 1;
  translate: 0 0;
}

.revelar.visible .pestana:nth-child(1) { transition-delay: 0s, 0s, 0s, 0.45s, 0.45s; }
.revelar.visible .pestana:nth-child(2) { transition-delay: 0s, 0s, 0s, 0.55s, 0.55s; }
.revelar.visible .pestana:nth-child(3) { transition-delay: 0s, 0s, 0s, 0.65s, 0.65s; }
.revelar.visible .pestana:nth-child(4) { transition-delay: 0s, 0s, 0s, 0.75s, 0.75s; }

@media (prefers-reduced-motion: reduce) {
  .revelar .pestana {
    opacity: 1;
    translate: none;
  }
}

.pestana svg {
  width: 28px;
  height: 28px;
  color: var(--oro);
  transition: color 0.3s ease;
}

.pestana.activa {
  background: var(--metal-rosa);
  border-color: transparent;
  color: #fff;
  transform: translateY(-4px);
}

.pestana.activa svg {
  color: #fff;
}

/* alto fijo (no salta al cambiar de pestaña) y el contenido centrado en él */
.panel-detalle {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 320px;
  margin: 26px auto 0;
  width: min(100%, 320px);
  padding: 40px 24px 32px;
  text-align: center;
}

.icono-panel {
  display: block;
  width: 56px;
  height: 56px;
  margin: 0 auto 14px;
  color: var(--oro);
}

.subtitulo {
  margin: 0 0 14px;
  font-family: var(--fuente-titulo);
  font-size: 1.5rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--oro);
}

.video-vestimenta {
  max-width: 170px;
  margin-bottom: 14px;
}

.nota {
  margin-top: 12px;
}

.lista {
  margin: 0;
  padding: 0;
  list-style: none;
  text-align: left;
}

.lista li {
  position: relative;
  padding: 0 0 12px 22px;
  font-size: 1.08rem;
  line-height: 1.4;
}

.lista li::before {
  content: "✦";
  position: absolute;
  left: 0;
  color: var(--oro);
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.formulario .btn-verde {
  align-self: center;
}

.error {
  margin: 0;
  color: #9b3b26;
  font-size: 0.95rem;
}

/* cambio de pestaña: el contenido se ilumina */
.cambio-enter-active,
.cambio-leave-active {
  transition:
    opacity 0.35s ease,
    filter 0.35s ease,
    transform 0.35s ease;
}
.cambio-enter-from,
.cambio-leave-to {
  opacity: 0;
  filter: blur(6px);
  transform: translateY(8px);
}
</style>
