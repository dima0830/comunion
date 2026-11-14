<template>
  <!-- CIERRE: "Te espero" dentro de un arco, con padres y padrinos -->
  <section class="final panel-rosa">
    <MariposasVolando :cantidad="3" />

    <div v-revelar class="seccion">
      <div class="arco arco-final">
        <p class="gracias">Con la bendición de Dios y el amor de mi familia</p>
        <p class="te-espero oro-brillante">Te espero</p>
        <p class="nombre">{{ datos.nombre }}</p>

        <div v-if="datos.padres.length" class="familia">
          <p class="rol">MIS PADRES</p>
          <p>{{ datos.padres.join(" y ") }}</p>
        </div>
        <div v-if="datos.padrinos.length" class="familia">
          <p class="rol">MIS PADRINOS</p>
          <p>{{ datos.padrinos.join(" y ") }}</p>
        </div>

        <!-- src/assets/images/protagonista-final.webp -->
        <img v-if="ilustracion" :src="ilustracion" :alt="`${datos.nombre} sonriendo`" class="ilustracion" />
      </div>
    </div>

    <GuirnaldaFlores />
  </section>
</template>

<script setup lang="ts">
import { datos } from "@/datos";

const imagenes = import.meta.glob<string>("../assets/images/protagonista-final.{webp,png,jpg}", { eager: true, query: "?url", import: "default" });
const ilustracion = Object.values(imagenes)[0] ?? null;
</script>

<style scoped>
.final {
  position: relative;
  overflow: hidden;
}

.final .seccion {
  position: relative;
  z-index: 2;
  padding: var(--espacio-seccion) 26px 170px;
}

.arco-final {
  width: min(100%, 320px);
  margin: 0 auto;
  padding: 46px 24px 0;
  overflow: hidden;
  background: linear-gradient(180deg, #fffaf7 0%, #fbf0ec 45%, #e3c7bc 80%);
}

.ilustracion {
  display: block;
  width: calc(100% + 48px);
  margin: 18px -24px 0;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  object-position: 50% 100%;
  -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 26%), linear-gradient(90deg, transparent 0%, #000 14%, #000 86%, transparent 100%);
  -webkit-mask-composite: source-in;
  mask-image: linear-gradient(180deg, transparent 0%, #000 26%), linear-gradient(90deg, transparent 0%, #000 14%, #000 86%, transparent 100%);
  mask-composite: intersect;
}

.gracias {
  max-width: 220px;
  margin: 0 auto 6px;
  font-size: 1.1rem;
  font-style: italic;
  color: var(--tinta);
}

.te-espero {
  margin: 0;
  padding: 0 0.15em;
  font-family: var(--fuente-cursiva);
  font-size: 3.6rem;
  line-height: 1.35;
}


.nombre {
  margin: 6px 0 0;
  font-family: var(--fuente-titulo);
  font-size: 1.3rem;
  letter-spacing: 5px;
  text-transform: uppercase;
  color: var(--titulo);
}

.familia {
  margin-top: 22px;
}

.familia p {
  margin: 0;
  font-size: 1.12rem;
  color: var(--tinta);
}

.familia .rol {
  margin-bottom: 2px;
  font-family: var(--fuente-mayus);
  font-size: 0.72rem;
  letter-spacing: 2.5px;
  color: var(--oro);
}
</style>
