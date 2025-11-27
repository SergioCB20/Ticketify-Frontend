# ✅ Checklist de Verificación - Sistema de Facturación

Use este checklist para verificar que todo esté funcionando correctamente.

---

## 📋 Pre-requisitos

### Instalación
- [ ] Node.js instalado (v18+)
- [ ] Dependencias instaladas (`npm install`)
- [ ] Sin errores de TypeScript (`npm run build`)
- [ ] Servidor de desarrollo corriendo (`npm run dev`)

### Usuario de Prueba
- [ ] Cuenta de usuario creada
- [ ] Usuario tiene rol `ORGANIZER`
- [ ] Usuario está autenticado
- [ ] Token válido en localStorage/cookies

---

## 🎯 Funcionalidades Principales

### 1. Acceso al Sistema
- [ ] El menú "Facturación" aparece en el sidebar (solo para organizadores)
- [ ] El menú NO aparece para usuarios sin rol ORGANIZER
- [ ] Click en "Facturación" navega a `/panel/billing`
- [ ] La página carga sin errores en consola
- [ ] Los usuarios no organizadores son redirigidos

### 2. Vista de Lista de Eventos
- [ ] Se muestra el título "Facturación" en la parte superior
- [ ] Se muestra el subtítulo descriptivo
- [ ] Aparece loading state al cargar (skeletons o spinner)
- [ ] Se cargan los eventos del organizador
- [ ] Cada evento muestra:
  - [ ] Nombre del evento
  - [ ] Badge de estado (Borrador/Publicado/etc)
  - [ ] Fecha del evento
  - [ ] Ingresos totales
  - [ ] Número de transacciones
  - [ ] Monto neto
  - [ ] Botón "Ver Detalle"
- [ ] Si no hay eventos, muestra mensaje "No hay eventos con facturación"
- [ ] Los cards son responsive (se adaptan a mobile)

### 3. Vista de Detalle del Evento
- [ ] Click en un evento carga su detalle
- [ ] Aparece loading state durante carga
- [ ] Header muestra:
  - [ ] Botón de "Volver"
  - [ ] Nombre del evento
  - [ ] Fecha del evento
  - [ ] Botón "Sincronizar"
  - [ ] Botón "Descargar Reporte" con dropdown
  - [ ] Última fecha de sincronización

### 4. Tarjetas de Resumen
- [ ] Se muestran 4 tarjetas en desktop (2x2 en tablet, 1 columna en mobile)
- [ ] **Tarjeta 1 - Ingresos Totales**:
  - [ ] Muestra el monto correcto formateado (S/.)
  - [ ] Muestra número de transacciones
  - [ ] Ícono apropiado
  - [ ] Color azul (info)
- [ ] **Tarjeta 2 - Total Comisiones**:
  - [ ] Muestra suma de comisiones MP + Plataforma
  - [ ] Subtítulo "MP + Plataforma"
  - [ ] Tooltip informativo al hover
  - [ ] Color amarillo (warning)
- [ ] **Tarjeta 3 - Monto Neto**:
  - [ ] Muestra monto después de comisiones
  - [ ] Subtítulo descriptivo
  - [ ] Color verde (success)
- [ ] **Tarjeta 4 - Acreditado**:
  - [ ] Muestra monto ya acreditado
  - [ ] Muestra monto pendiente si hay
  - [ ] Color primario

### 5. Desglose de Comisiones
- [ ] Se muestra el componente "Desglose de Comisiones"
- [ ] Barra visual horizontal con 3 secciones:
  - [ ] Verde (Neto)
  - [ ] Naranja (Mercado Pago)
  - [ ] Azul (Plataforma)
- [ ] Porcentajes calculados correctamente
- [ ] Lista detallada muestra:
  - [ ] Comisión MP con porcentaje y monto
  - [ ] Comisión Plataforma con porcentaje y monto
  - [ ] Total comisiones en rojo
  - [ ] Monto neto en verde destacado
- [ ] Mensaje informativo en el footer

### 6. Gráfico de Métodos de Pago
- [ ] Se muestra el componente "Métodos de Pago"
- [ ] Barras horizontales por cada método
- [ ] Colores distintivos para cada método
- [ ] Muestra para cada método:
  - [ ] Nombre en español
  - [ ] Porcentaje
  - [ ] Número de transacciones
  - [ ] Monto total
- [ ] Resumen con badges coloridos
- [ ] Mensaje informativo en el footer
- [ ] Si no hay datos, muestra mensaje apropiado

### 7. Tabla de Transacciones
- [ ] Se muestra el título "Transacciones (N)"
- [ ] Dropdown de filtros funciona:
  - [ ] Todos
  - [ ] Aprobados
  - [ ] Pendientes
  - [ ] Rechazados
  - [ ] Reembolsados
- [ ] **En Desktop** - Vista de tabla:
  - [ ] Headers clickeables para ordenar
  - [ ] Columnas: Fecha, Comprador, Monto, Método, Comisiones, Neto, Estado
  - [ ] Hover effect en filas
  - [ ] Badges de estado con colores correctos
- [ ] **En Mobile** - Vista de cards:
  - [ ] Información en formato vertical
  - [ ] Todos los datos visibles
  - [ ] Fácil de leer
- [ ] Ordenamiento funciona:
  - [ ] Por fecha (asc/desc)
  - [ ] Por monto (asc/desc)
  - [ ] Ícono de flecha indica dirección
- [ ] Si no hay transacciones filtradas, muestra mensaje

### 8. Sincronización
- [ ] Click en botón "Sincronizar" funciona
- [ ] Botón muestra estado de "Sincronizando..." con spinner
- [ ] Botón queda deshabilitado durante sync
- [ ] Después de sync, datos se actualizan
- [ ] Mensaje de éxito/error aparece
- [ ] Fecha de última sincronización se actualiza

### 9. Descarga de Reportes
- [ ] Click en "Descargar Reporte" abre dropdown
- [ ] Dropdown muestra opciones:
  - [ ] Descargar PDF
  - [ ] Descargar Excel
- [ ] Click en opción inicia descarga
- [ ] Botón muestra "Descargando..." durante proceso
- [ ] Archivo se descarga con nombre apropiado
- [ ] Formato del nombre: `facturacion-[evento]-[fecha].[ext]`

---

## 🎨 UI/UX

### Responsive
- [ ] **Desktop (1920px)**:
  - [ ] Layout de 4 columnas en tarjetas
  - [ ] Tabla completa visible
  - [ ] Sidebar fijo
- [ ] **Tablet (768px)**:
  - [ ] Layout de 2 columnas en tarjetas
  - [ ] Tabla adaptada o scroll horizontal
  - [ ] Menú colapsable
- [ ] **Mobile (375px)**:
  - [ ] Layout de 1 columna
  - [ ] Cards verticales
  - [ ] Transacciones en formato card
  - [ ] Menú hamburguesa funcional

### Estados Visuales
- [ ] **Loading**:
  - [ ] Skeletons en lista de eventos
  - [ ] Spinner en detalle
  - [ ] Botones muestran estado de carga
- [ ] **Error**:
  - [ ] Mensaje claro y visible
  - [ ] Opción de reintentar
  - [ ] No rompe la interfaz
- [ ] **Empty**:
  - [ ] Mensaje "No hay eventos"
  - [ ] Ícono ilustrativo
  - [ ] Texto explicativo
- [ ] **Success**:
  - [ ] Datos se muestran correctamente
  - [ ] Animaciones suaves

### Interactividad
- [ ] Todos los botones tienen hover effect
- [ ] Links cambian de color al hover
- [ ] Transiciones suaves (no bruscas)
- [ ] Tooltips aparecen al pasar mouse
- [ ] Cards tienen sombra al hover
- [ ] Estados de focus visibles para accesibilidad

### Colores
- [ ] Estados con colores correctos:
  - [ ] 🟢 Aprobado = Verde
  - [ ] 🟡 Pendiente = Amarillo
  - [ ] 🔴 Rechazado = Rojo
  - [ ] ⚫ Reembolsado = Gris
  - [ ] 🟠 Contracargo = Naranja
- [ ] Comisiones en rojo (negativo)
- [ ] Montos netos en verde (positivo)
- [ ] Contraste adecuado para lectura

---

## 🔐 Seguridad

### Autenticación
- [ ] Usuario debe estar logueado para acceder
- [ ] Redirección a `/login` si no autenticado
- [ ] Token se envía en todas las peticiones

### Autorización
- [ ] Solo usuarios con rol `ORGANIZER` pueden ver facturación
- [ ] Usuarios sin rol son redirigidos a `/panel/profile`
- [ ] Backend valida que el evento pertenezca al organizador

### Datos Sensibles
- [ ] Emails de compradores solo visibles al organizador dueño
- [ ] Montos y comisiones solo del organizador
- [ ] No hay información de otros organizadores

---

## 🐛 Manejo de Errores

### Errores de Red
- [ ] Request fallido muestra mensaje claro
- [ ] Opción de reintentar disponible
- [ ] No crash la aplicación
- [ ] Console.error para debugging

### Errores de Datos
- [ ] Datos faltantes no rompen UI
- [ ] Valores null/undefined manejados
- [ ] Fallbacks apropiados

### Errores de Usuario
- [ ] Intentar descargar sin permisos = mensaje claro
- [ ] Sincronizar sin conexión = mensaje apropiado
- [ ] Filtros sin resultados = mensaje informativo

---

## 📊 Formatos

### Monedas
- [ ] Formato: `S/ 1,500.50`
- [ ] Separador de miles: coma
- [ ] Decimales: siempre 2
- [ ] Símbolo: S/ (Sol peruano)

### Fechas
- [ ] Formato largo: "20 de noviembre de 2025"
- [ ] Formato corto: "20 nov 2025, 10:30"
- [ ] Timezone: Local (Perú)
- [ ] Lenguaje: Español

### Porcentajes
- [ ] Formato: "4.5%"
- [ ] 1 decimal
- [ ] Símbolo de porcentaje

---

## 🧪 Testing con Mock Data

### Usar Datos Mock
- [ ] Importar `mockBillingService` en lugar de `billingService`
- [ ] Verificar que carga 3 eventos de ejemplo
- [ ] Verificar que muestra 5 transacciones de ejemplo
- [ ] Verificar que sincronización simula delay
- [ ] Verificar que descarga simula archivo

### Volver a API Real
- [ ] Cambiar import de vuelta a `billingService`
- [ ] Verificar que conecta con backend
- [ ] Verificar que maneja errores reales

---

## 📱 Navegación

### Flujo Completo
1. [ ] Login como ORGANIZER
2. [ ] Ir a Panel
3. [ ] Click en "Facturación"
4. [ ] Ver lista de eventos
5. [ ] Click en un evento
6. [ ] Ver detalle completo
7. [ ] Sincronizar datos
8. [ ] Descargar reporte PDF
9. [ ] Filtrar transacciones
10. [ ] Ordenar por fecha/monto
11. [ ] Volver a lista
12. [ ] Seleccionar otro evento

---

## ⚡ Performance

### Tiempos de Carga
- [ ] Lista de eventos carga en < 2 segundos
- [ ] Detalle de evento carga en < 3 segundos
- [ ] Sincronización completa en < 5 segundos
- [ ] Descarga de reporte inicia en < 3 segundos

### Optimizaciones
- [ ] Imágenes optimizadas (si hay)
- [ ] Sin re-renders innecesarios
- [ ] Componentes se cargan solo cuando se necesitan
- [ ] Datos se cachean apropiadamente

---

## 🌐 Compatibilidad

### Navegadores
- [ ] Chrome (última versión)
- [ ] Firefox (última versión)
- [ ] Safari (última versión)
- [ ] Edge (última versión)

### Dispositivos
- [ ] Desktop (Windows/Mac/Linux)
- [ ] Tablet (iPad/Android)
- [ ] Mobile (iOS/Android)

---

## 📝 Checklist Final

### Antes de Desplegar
- [ ] Todos los componentes funcionan
- [ ] No hay errores en consola
- [ ] No hay warnings de TypeScript
- [ ] Responsive en todos los tamaños
- [ ] Textos en español correctos
- [ ] Formatos de moneda/fecha correctos
- [ ] Loading states en todas las acciones
- [ ] Error handling completo
- [ ] Documentación completa
- [ ] Código comentado donde necesario

### Conectar con Backend
- [ ] Backend implementó los 4 endpoints
- [ ] CORS configurado correctamente
- [ ] Tokens de autenticación funcionan
- [ ] Webhooks de Mercado Pago configurados
- [ ] Generación de PDF/Excel funciona
- [ ] Datos reales se muestran correctamente

---

## 🎉 Estado General

Marca el estado general de cada sección:

- [ ] ✅ **UI Completa** - Todos los componentes visibles y funcionales
- [ ] ✅ **UX Completa** - Interacciones suaves y lógicas
- [ ] ✅ **Responsive** - Funciona en todos los dispositivos
- [ ] ✅ **Seguridad** - Autenticación y autorización funcionan
- [ ] ✅ **Errores** - Manejo completo de errores
- [ ] ⏳ **Backend** - Endpoints implementados y funcionando
- [ ] ⏳ **Testing** - Tests automatizados escritos
- [ ] ⏳ **Production** - Desplegado y funcionando en producción

---

**Una vez completado este checklist, el sistema estará listo para producción.** ✅

¿Encontraste algún problema? Revisa:
1. 📖 `BILLING_IMPLEMENTATION.md` - Guía de implementación
2. 📚 `BILLING_EXAMPLES.md` - Ejemplos de uso
3. 📋 `src/components/billing/README.md` - Documentación técnica
4. 🐛 Console del navegador - Errores de JavaScript
5. 🌐 Network tab - Errores de API
