<template>
  <section class="final-section panel">
    <div v-revelar class="seccion despedida">
      <p class="gracias">Con la bendición de Dios y el amor de mi familia</p>
      <p class="nombres">{{ datos.nombre }}</p>
      <span class="filete" aria-hidden="true"></span>
      <p class="los-esperamos">¡Te espero!</p>
      <div v-if="datos.padres.length" class="familia">
        <p class="titulo-mayus">MIS PADRES</p>
        <p>{{ datos.padres.join(" y ") }}</p>
      </div>
      <div v-if="datos.padrinos.length" class="familia">
        <p class="titulo-mayus">MIS PADRINOS</p>
        <p>{{ datos.padrinos.join(" y ") }}</p>
      </div>
    </div>

    <!-- rosas creciendo desde el borde inferior: cierran la invitación -->
    <GuirnaldaFlores tipo="abajo" />
  </section>
</template>

<script setup lang="ts">
import { datos } from "@/datos";
</script>

<style scoped>
.final-section {
  position: relative;
  overflow: hidden;
}

.despedida {
  padding-top: 100px;
  padding-bottom: 190px;
}

.nombres {
  display: flex;
  flex-direction: column;
  margin: 0;
  font-family: var(--fuente-cursiva);
  font-size: 3.6rem;
  line-height: 1;
  color: var(--titulo);
}

.filete {
  display: block;
  width: 110px;
  height: 1px;
  margin: 16px auto 12px;
  background: linear-gradient(90deg, transparent, var(--oro), transparent);
}

.los-esperamos {
  margin: 0;
  font-size: 1.4rem;
  font-style: italic;
  color: var(--tinta);
}

.gracias {
  max-width: 260px;
  margin: 0 auto 18px;
  font-size: 1.1rem;
  font-style: italic;
  color: var(--tinta);
}

.familia {
  margin-top: 26px;
}

.familia .titulo-mayus {
  margin: 0 0 4px;
  font-size: 0.85rem;
}

.familia p:last-child {
  margin: 0;
  font-size: 1.15rem;
  color: var(--tinta);
}
</style>
