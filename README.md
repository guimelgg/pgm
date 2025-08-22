# 🏋️ Plan de Ganancia Muscular (PGM)

Una aplicación web interactiva para planificar tu entrenamiento y nutrición con el objetivo de ganar masa muscular de forma efectiva y segura.

## 🌟 Características Principales

- **📊 Calculadora de Metas Nutricionales**: Calcula automáticamente tus necesidades calóricas, proteínas e hidratación
- **💪 Plan de Entrenamiento Push/Pull/Legs**: Rutina estructurada de 6 días con día de descanso
- **🍽️ Guía de Nutrición**: Distribución de macronutrientes con gráficos interactivos
- **🤖 Chat con IA**: Asistente virtual para resolver dudas sobre fitness y nutrición
- **👤 Sistema de Login**: Autenticación con Google para personalizar tu experiencia
- **📱 Diseño Responsive**: Optimizado para desktop y móviles
- **💾 Persistencia de Datos**: Guarda tus datos localmente en el navegador

## 🚀 Demo en Vivo

Visita la aplicación en: **https://guimelgg.github.io/pgm/**

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Frameworks CSS**: Tailwind CSS
- **Gráficos**: Chart.js
- **APIs**: Google Sign-In, Google Gemini AI
- **Fuentes**: Google Fonts (Inter)

## 📋 Funcionalidades

### ✅ Disponibles sin configuración
- Calculadora de necesidades nutricionales
- Plan de entrenamiento completo con ejercicios
- Visualización de ejercicios (GIFs y videos)
- Gráficos de distribución de macronutrientes
- Almacenamiento local de datos del usuario
- Modo invitado completamente funcional

### ⚙️ Requieren configuración
- **Chat con IA**: Necesita API Key de Google Gemini
- **Login con Google**: Necesita Client ID de Google Cloud

## 🔧 Configuración (Opcional)

Para habilitar todas las funcionalidades, consulta el archivo [`CONFIGURACION.md`](CONFIGURACION.md) que incluye:

1. **API Key de Google Gemini** para el chat con IA
2. **Client ID de Google** para el sistema de login

## 📱 Instalación y Uso

### Opción 1: Usar la versión en línea
Simplemente visita: https://guimelgg.github.io/pgm/

### Opción 2: Ejecutar localmente
```bash
# Clonar el repositorio
git clone https://github.com/guimelgg/pgm.git

# Navegar al directorio
cd pgm

# Abrir en navegador
# Simplemente abre index.html en tu navegador web
```

## 📖 Cómo Usar la Aplicación

1. **Configura tus datos**: Ingresa edad, peso y altura en la sección "Mis Datos"
2. **Revisa tu resumen**: Ve tus metas nutricionales calculadas automáticamente
3. **Explora el plan semanal**: Revisa los ejercicios de cada día
4. **Aprende sobre nutrición**: Consulta las fuentes recomendadas de macronutrientes
5. **Aplica los principios**: Lee los conceptos clave para maximizar resultados

## 🎯 Metodología de Entrenamiento

La aplicación implementa el sistema **Push/Pull/Legs**:

- **Push (Empuje)**: Pecho, hombros, tríceps
- **Pull (Tire)**: Espalda, bíceps
- **Legs (Piernas)**: Cuádriceps, glúteos, isquiotibiales, pantorrillas

### Estructura Semanal
```
Día 1: Empuje → Día 2: Tire → Día 3: Piernas → 
Día 4: Empuje → Día 5: Tire → Día 6: Piernas → Día 7: Descanso
```

## 🍎 Enfoque Nutricional

- **Calorías**: Calculadas según fórmula de Harris-Benedict + factor de actividad
- **Proteínas**: 2.2g por kg de peso corporal
- **Hidratación**: 35ml por kg de peso corporal
- **Distribución de macros**: Proteínas 25%, Carbohidratos 45%, Grasas 30%

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 🐛 Reportar Problemas

Si encuentras algún bug o tienes sugerencias, por favor abre un [issue](https://github.com/guimelgg/pgm/issues).

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Guillermo González**
- GitHub: [@guimelgg](https://github.com/guimelgg)

## 🙏 Agradecimientos

- A la comunidad de fitness por la inspiración
- A los desarrolladores de las librerías utilizadas
- A Google por las APIs gratuitas

## 📊 Estado del Proyecto

![Status](https://img.shields.io/badge/Status-Activo-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

⭐ **¡Si te gusta este proyecto, dale una estrella!** ⭐
