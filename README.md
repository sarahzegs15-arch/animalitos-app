# 🐾 Animalitos a bañar

Juego para bebés (2–3 años) pensado para iPad con iOS 12.5.x. Funciona **sin internet** una vez instalado.

Los animalitos empiezan sucios, despeinados y tristes. Con las herramientas de la izquierda (jabón, manguera,
shampoo, peine, toalla y cepillo de dientes) se bañan, se peinan, se secan y se cepillan los dientes.
Cada herramienta tiene animación y sonido, y cada animalito tiene su vocecita kawaii.

## Cómo subirlo a GitHub (GitHub Pages)

1. Crea un repositorio nuevo en GitHub (por ejemplo `animalitos`).
2. Sube **todo el contenido de esta carpeta** (incluyendo `images/`, `icons/` y el archivo `.nojekyll`).
3. En el repositorio: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   elige la rama `main` y la carpeta `/ (root)`. Guarda.
4. Espera 1–2 minutos. Tu juego quedará en `https://TU-USUARIO.github.io/animalitos/`.

## Cómo instalarlo en el iPad (para que funcione sin wifi)

1. Con wifi, abre la dirección de arriba en **Safari**.
2. Espera unos segundos a que cargue y se vean los animalitos (así se guarda todo en el iPad).
3. Toca el botón **Compartir** → **Añadir a pantalla de inicio**.
4. Abre el juego desde ese ícono. Para comprobarlo, activa el modo avión y ábrelo de nuevo: debe funcionar igual.

## Botones para mamá y papá (esquina superior derecha)

Se activan **manteniéndolos presionados casi 1 segundo** para que el bebé no los toque sin querer:

- 🔈 Silenciar / activar sonido.
- 🔄 Volver a ensuciar a todos los animalitos.

## Para el bebé

- Toca un animalito (sin herramienta) y hará su sonidito. Si está sucio suena triste, si está limpio suena feliz.
- Toca una herramienta y luego pasa el dedo sobre el animalito. Vuelve a tocarla para soltarla.
- Las flechas y las miniaturas de abajo cambian de animalito. Una estrellita marca al que ya quedó limpio y feliz.
- Toca las luciérnagas del fondo: brillan y suenan.

## Si cambias algo

Los archivos se guardan en el iPad con un “service worker”. Si modificas cualquier archivo, abre `sw.js`
y cambia `VERSION = 'animalitos-v1'` por `'animalitos-v2'` (y así sucesivamente) para que los dispositivos se actualicen.

## Archivos

- `index.html`, `style.css`, `app.js`: el juego (JavaScript clásico, compatible con Safari de iOS 12).
- `sw.js`, `manifest.json`: para que funcione sin internet y se instale como app.
- `images/`: cada animalito en versión limpia y versión sucia/triste.
- `icons/`: ícono de la app.
