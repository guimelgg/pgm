# 🏋️ Configuración de la Aplicación de Fitness

## ⚠️ **Configuraciones Requeridas**

### 1. **API Key de Google Gemini (Para el Chat con IA)**

1. Ve a [Google AI Studio](https://aistudio.google.com/)
2. Crea una cuenta o inicia sesión
3. Obtén tu API Key gratuita
4. En el archivo `script.js`, línea aproximada 177, reemplaza:
   ```javascript
   const apiKey = ""; // ⚠️ IMPORTANTE: Debes agregar tu API Key aquí
   ```
   Por:
   ```javascript
   const apiKey = "TU_API_KEY_AQUI";
   ```

#### **⚠️ Limitaciones de la API Gratuita:**
- **15 consultas por minuto**
- **1,500 consultas por día**
- Suficiente para uso personal/demostración
- Para uso comercial considera el plan de pago

#### **💡 Optimización del Uso:**
- Evita hacer preguntas muy largas
- El código ya incluye límite de 500 caracteres por mensaje
- Mensajes concisos = mejor rendimiento

### 2. **Client ID de Google Sign-In (Para el Login)**

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la "Google Sign-In API"
4. Ve a "Credenciales" > "Crear credenciales" > "ID de cliente de OAuth 2.0"
5. Configura como "Aplicación web"
6. Agrega tu dominio a "Orígenes autorizados de JavaScript"
7. **Configurar pantalla de consentimiento:**
   - Ve a "Pantalla de consentimiento de OAuth"
   - Sube el logotipo de la aplicación (usa `logo-viewer.html` para generar el PNG)
   - Especificaciones: 120x120 píxeles, formato PNG/JPG, máximo 1 MB
8. Copia el Client ID generado
9. Reemplaza en **dos lugares**:

   **En `index.html` (línea 6):**
   ```html
   <meta name="google-signin-client_id" content="TU_CLIENT_ID_AQUI.apps.googleusercontent.com">
   ```

   **En `script.js` (línea aproximada 385):**
   ```javascript
   client_id: 'TU_CLIENT_ID_AQUI.apps.googleusercontent.com',
   ```

#### **🎨 Logotipo de la Aplicación:**
- **Archivo:** Abre `logo-viewer.html` en tu navegador
- **Opciones:** 3 diseños diferentes disponibles
- **Conversión:** Botón para convertir SVG a PNG automáticamente
- **Especificaciones:** Cumple con todos los requisitos de Google

## 🚀 **Estado Actual de las Funcionalidades**

| Funcionalidad | Estado | Requiere Configuración |
|---------------|--------|------------------------|
| Calculadora de Metas | ✅ Funcional | No |
| Plan de Entrenamiento | ✅ Funcional | No |
| Visualización de Ejercicios | ✅ Funcional | No |
| Gráfico de Macronutrientes | ✅ Funcional | No |
| Persistencia de Datos (localStorage) | ✅ Funcional | No |
| Modo Invitado | ✅ Funcional | No |
| Chat con IA | ⚠️ Requiere API Key | Sí |
| Login con Google | ⚠️ Requiere Client ID | Sí |

## 🔧 **Mejoras Implementadas**

### Validación y Manejo de Errores
- ✅ Validación de datos en localStorage
- ✅ Manejo de datos corruptos
- ✅ Validación de inputs numéricos
- ✅ Feedback visual para campos inválidos
- ✅ Mensajes de error descriptivos

### Optimización de Rendimiento
- ✅ Debounce en inputs para evitar cálculos excesivos
- ✅ Validación antes de guardar en localStorage
- ✅ Verificación de elementos DOM antes de usar

### Experiencia de Usuario
- ✅ La app funciona completamente sin configuración
- ✅ Mensajes informativos cuando las APIs no están configuradas
- ✅ Fallback graceful cuando hay errores

## 📱 **Funcionalidad PWA**

Para que funcione como PWA, necesitas:
1. Servir la aplicación desde un servidor HTTPS
2. Crear un archivo `manifest.json` (referenciado en el HTML pero no incluido)
3. Implementar un Service Worker para funcionalidad offline

## 🐛 **Cómo Probar**

1. **Sin configuración**: La app funciona completamente en modo invitado
2. **Con API Key de Gemini**: El chat con IA estará disponible
3. **Con Client ID de Google**: El login/logout funcionará

## 📝 **Notas Técnicas**

- Los datos se guardan en `localStorage` del navegador
- Cada usuario (por email) tiene sus propios datos
- El modo invitado usa claves genéricas (`-guest`)
- La app es responsive y funciona en móviles
- Los GIFs y videos son enlaces externos (requieren internet)

## 🆘 **Solución de Problemas**

- **Error en chat**: Verifica la API Key de Gemini
- **Error en login**: Verifica el Client ID de Google
- **Datos perdidos**: Revisa si cambió el email de login
- **Error de carga**: Verifica que `data.json` esté en la misma carpeta

### **Errores Comunes de la API de Gemini:**
- **"Quota exceeded"**: Has superado el límite de 15 consultas/minuto o 1,500/día
- **"API key not valid"**: Verifica que copiaste correctamente la API Key
- **"Model not found"**: El modelo `gemini-2.5-flash-preview-05-20` podría haber cambiado

## 📊 **Monitoreo de Uso de API**

Para monitorear tu consumo:
1. Ve a [Google AI Studio](https://aistudio.google.com/)
2. Sección "Usage" para ver tus límites actuales
3. La app mostrará errores informativos si superas los límites

## 💰 **Planes de Pago**

Si necesitas más capacidad:
- **Pay-per-use**: $0.000125 por 1K tokens de entrada
- **Sin límites estrictos de RPM**
- Ideal para aplicaciones comerciales
