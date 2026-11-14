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

  const respuesta = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cuerpo),
  });
  if (!respuesta.ok) throw new Error(`El servidor respondió ${respuesta.status}`);
}
