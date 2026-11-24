import { datos } from "@/datos";

/*
  Envía un formulario al servidor (POST con JSON).
  En una tarjeta de muestra (datos.modoMuestra) no envía nada: espera un
  momento, como si guardara, y termina bien, para que quien la pruebe vea el
  mensaje de agradecimiento en lugar de un error.
*/
export async function enviarFormulario(url: string, cuerpo: unknown): Promise<void> {
  if (datos.modoMuestra) {
    await new Promise((listo) => setTimeout(listo, 900));
    return;
  }

  if (datos.hojaConfirmaciones) {
    await enviarAHoja(url, cuerpo);
    return;
  }

  const respuesta = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cuerpo),
  });
  if (!respuesta.ok) throw new Error(`El servidor respondió ${respuesta.status}`);
}

/*
  Plan Básica: guarda en la hoja de Google de Innube (Apps Script).
  Se envía como texto plano para que el navegador no haga la consulta
  previa (CORS) que Apps Script no responde. "/api/rsvp" va a la pestaña
  del evento y "/api/canciones" a "evento · canciones".
*/
async function enviarAHoja(url: string, cuerpo: unknown): Promise<void> {
  const tipo = url.includes("foto") ? "fotos" : url.includes("cancion") ? "canciones" : "confirmaciones";
  const respuesta = await fetch(datos.hojaConfirmaciones, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ evento: datos.evento, tipo, ...(cuerpo as object) }),
  });
  const resultado = await respuesta.json().catch(() => null);
  if (!respuesta.ok || !resultado?.ok) throw new Error("No se pudo guardar en la hoja");
}

/* Igual, pero para subir archivos (fotos y videos) */
export async function enviarArchivos(url: string, datosFormulario: FormData): Promise<void> {
  if (datos.modoMuestra) {
    await new Promise((listo) => setTimeout(listo, 1400));
    return;
  }

  if (datos.hojaConfirmaciones) {
    await subirAHoja(datosFormulario);
    return;
  }

  const respuesta = await fetch(url, { method: "POST", body: datosFormulario });
  if (!respuesta.ok) throw new Error(`El servidor respondió ${respuesta.status}`);
}

/*
  FOTOS DE LOS INVITADOS A DRIVE (plan Básica)
  Cada archivo se envía por separado a la hoja de Google, que lo guarda en
  la carpeta del evento en Drive. Las fotos se reducen antes de subir
  (lado mayor de 2560 px, JPEG) para que suban rápido desde el celular.
  Apps Script recibe como máximo unos 50 MB por envío: los videos de más de
  35 MB se rechazan con un mensaje.
*/
const MAX_LADO = 2560;
const MAX_ARCHIVO = 35 * 1024 * 1024;

async function subirAHoja(formulario: FormData): Promise<void> {
  const archivos = [...formulario.values()].filter((v): v is File => v instanceof File);
  for (const archivo of archivos) {
    const preparado = await prepararArchivo(archivo);
    await enviarAHoja("/api/fotos", preparado);
  }
}

async function prepararArchivo(archivo: File) {
  if (archivo.type.startsWith("image/") && archivo.type !== "image/gif") {
    try {
      const reducido = await reducirFoto(archivo);
      return {
        nombreArchivo: archivo.name.replace(/\.[^.]+$/, "") + ".jpg",
        tipoArchivo: "image/jpeg",
        archivo: await aBase64(reducido),
      };
    } catch {
      // formato que el navegador no sabe dibujar (p. ej. HEIC fuera de Safari): se sube tal cual
    }
  }
  if (archivo.size > MAX_ARCHIVO) throw new Error("El archivo es demasiado pesado");
  return { nombreArchivo: archivo.name, tipoArchivo: archivo.type || "application/octet-stream", archivo: await aBase64(archivo) };
}

async function reducirFoto(archivo: File): Promise<Blob> {
  const imagen = await createImageBitmap(archivo);
  const escala = Math.min(1, MAX_LADO / Math.max(imagen.width, imagen.height));
  const lienzo = document.createElement("canvas");
  lienzo.width = Math.round(imagen.width * escala);
  lienzo.height = Math.round(imagen.height * escala);
  lienzo.getContext("2d")!.drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
  imagen.close();
  return new Promise((listo, fallo) =>
    lienzo.toBlob((b) => (b ? listo(b) : fallo(new Error("No se pudo reducir"))), "image/jpeg", 0.85),
  );
}

function aBase64(blob: Blob): Promise<string> {
  return new Promise((listo, fallo) => {
    const lector = new FileReader();
    lector.onload = () => listo(String(lector.result).split(",")[1]);
    lector.onerror = () => fallo(lector.error);
    lector.readAsDataURL(blob);
  });
}
