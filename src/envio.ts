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
  const tipo = url.includes("cancion") ? "canciones" : "confirmaciones";
  const respuesta = await fetch(datos.hojaConfirmaciones, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ evento: datos.evento, tipo, ...(cuerpo as object) }),
  });
  const resultado = await respuesta.json().catch(() => null);
  if (!respuesta.ok || !resultado?.ok) throw new Error("No se pudo guardar en la hoja");
}
