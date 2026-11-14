/*
  DATOS DE LA INVITACIÓN
  Cambia aquí el nombre, la fecha y los lugares: toda la invitación se
  actualiza sola. (Los valores actuales son de ejemplo.)
*/
export const datos = {
  /*
    Tarjeta de muestra: los formularios (confirmación y canción) no envían
    nada, solo muestran el mensaje de agradecimiento.
    Ponlo en false para una invitación real con servidor.
  */
  modoMuestra: true,

  /* Nombre como se mostrará en letra caligráfica */
  nombre: "Sofía",
  /* Nombre completo, para el cierre */
  nombreCompleto: "Sofía Martínez",

  /* Fecha y hora de la misa, con zona horaria (Colombia: -05:00) */
  fecha: "2027-05-16T10:00:00-05:00",

  /* Frase de la portada */
  frase: "«Dejad que los niños vengan a mí»",
  cita: "Mateo 19, 14",

  ceremonia: {
    titulo: "Santa Misa",
    lugar: "Parroquia San José",
    hora: "10:00 AM",
    mapa: "https://maps.google.com/?q=Parroquia+San+Jose",
  },

  recepcion: {
    titulo: "Recepción",
    lugar: "Salón Los Olivos",
    hora: "12:30 PM",
    mapa: "https://maps.google.com/?q=Salon+Los+Olivos",
  },

  /* Padrinos (déjalo vacío [] para ocultarlos) */
  padrinos: ["Carlos Pérez", "Laura Gómez"],
  /* Padres */
  padres: ["Andrés Martínez", "Paula Rojas"],

  /*
    Frases al pie de cada foto de "Un bello recuerdo", en el mismo orden que
    las fotos (sofia1, sofia2, …). Si una foto no tiene frase, el pie va vacío.
  */
  pieFotos: ["Esperando este día", "Con mi Biblia", "En oración", "Con alegría y fe"],
};

/* Partes de la fecha ya listas para mostrar */
const f = new Date(datos.fecha);
const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const DIAS = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];
const enZona = new Date(f.getTime() + (f.getTimezoneOffset() - 300) * 60000); // hora de Colombia
export const fechaPartes = {
  dia: enZona.getDate(),
  mes: MESES[enZona.getMonth()],
  anio: enZona.getFullYear(),
  diaSemana: DIAS[enZona.getDay()],
};
