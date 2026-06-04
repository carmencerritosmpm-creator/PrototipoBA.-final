# Tabot · Alta Fidelidad v5 · Banco Agrícola

Prototipo interactivo de alta fidelidad del chatbot Tabot para WhatsApp Business API.
Estilo visual basado en benchmarks Samsung Latam, AFP Crecer y AFP Confia.

---

## Cómo abrir el proyecto en VS Code

1. Abre VS Code
2. **Archivo → Abrir carpeta** → selecciona `TABOT_ProyectoVSCode_v5`
3. Instala las extensiones recomendadas cuando VS Code lo sugiera (especialmente **Live Server**)
4. Haz clic derecho sobre `index.html` → **Open with Live Server**
5. El prototipo se abre automáticamente en el navegador en `localhost:5500`

---

## Estructura del proyecto

```
TABOT_ProyectoVSCode_v5/
├── index.html          ← Estructura HTML del simulador
├── css/
│   └── styles.css      ← Todos los estilos (WhatsApp dark theme)
├── js/
│   └── app.js          ← Lógica completa: flujos, menús, keywords, ACTIONS
├── .vscode/
│   ├── settings.json   ← Configuración del editor
│   └── extensions.json ← Extensiones recomendadas
└── README.md           ← Este archivo
```

---

## Escenarios de prueba disponibles

| Escenario | Perfil | Rama |
|---|---|---|
| 💳 Andrea · Cliente frecuente | Saldo, EDC, pago TDC | A |
| ❓ Roberto · Cargo no reconocido | Disputa y bloqueo | B |
| 🚨 Andrea · Emergencia | "perdí mi tarjeta" → bloqueo | B |
| 🔎 Carlos · Invitado | Catálogo y cita | C |
| 🌐 Desde el sitio web | Redirigido desde campaña | WEB |
| 📱 Desde la app móvil | Soporte directo | APP |

---

## Palabras clave activas (escríbelas en cualquier momento)

- `saldo tarjeta` → Consulta de saldos y puntos TDC
- `bloqueo TDC` → Bloqueo y reposición de TDC
- `EDC tarjeta` → Estado de cuenta (últimos 3 cortes)
- `reversa de membresía` → Solicitud de reversa
- `viaje` → Notificación de viajero
- `activación TDC` → Activar tarjeta nueva
- `gestión LES` → Fraude · asesor especializado
- `asistencia X` → Seguimiento desde X
- `cita` → Link para agendar cita

---

## Comandos de navegación

| Escribe | Resultado |
|---|---|
| `menú` / `inicio` | Ir al menú principal |
| `volver` / `atrás` | Regresar a la pantalla anterior |
| `asesor` / `humano` | Conectar con asesor |
| `salir` / `gracias` | Cerrar conversación |
| `hola` / `buenas` | Saludo con bienvenida cálida |
| `borrar` | Reiniciar sesión completa |

---

## Notas de edición

- Todos los **mensajes de Tabot** están en `js/app.js` dentro de cada función `async function flow*()`
- Los **menús de opciones** se configuran en el objeto `MENUS` al inicio de `app.js`
- Las **palabras clave** se definen en el objeto `KW`
- Las **acciones de botones** están en el objeto `ACTIONS`
- Para cambiar **colores**, edita las variables CSS en `css/styles.css` bajo `:root{}`

---

## Criterios de diseño implementados

- ✅ Menús de despliegue tipo Samsung (bottom sheet con radio buttons)
- ✅ Trato de **tú** en todos los mensajes (Narrativa v3)
- ✅ Datos sensibles siempre enmascarados (DUI, correo, teléfono)
- ✅ Espera activa: sin vacíos ni pausas incómodas
- ✅ Salidas siempre disponibles: Inicio · Asesor · Salir
- ✅ Detección de emergencias en tiempo real
- ✅ Fallbacks empáticos y rotativos (7 variaciones)
- ✅ Respuesta cálida a saludos ("hola", "buenas", etc.)
- ✅ Navegación con "volver" usando pila de historial
- ✅ Tres puntos de entrada: directo, sitio web, app móvil
- ✅ Responsive: computadora · tablet · celular

---

*Proyecto generado como parte del diseño UX/UI de Tabot · Banco Agrícola · 2026*
