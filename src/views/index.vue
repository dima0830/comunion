<template>
  <main class="invitation-shell">
    <PortadaArco :activa="true" />
    <SeccionCelebracion />
    <RecuerdosPolaroid />
    <!-- oración que se ilumina al bajar -->
    <OracionScroll />
    <DetallesPestanas />
    <!-- Comparte tus fotos -->
    <PhotoUpload />
    <!-- Confirmación -->
    <InvitationForm />
    <FinalArco />

    <!-- Sello giratorio que lleva a confirmar -->
    <SelloConfirmar />
    <!-- Botón flotante de música (solo si hay canción) -->
    <InvitationAudio />
  </main>
</template>
