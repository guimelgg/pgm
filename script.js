let workoutData = {};
let currentUser = null;
let chatHistory = [];

// --- Funciones de Autenticación ---
function onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();
    currentUser = {
        id: profile.getId(),
        name: profile.getName(),
        imageUrl: profile.getImageUrl(),
        email: profile.getEmail()
    };
    updateUiForLogin();
    loadUserData(); // Carga los datos específicos del usuario
    loadChatHistory();
}

function signOut() {
    try {
        const auth2 = gapi.auth2.getAuthInstance();
        if (auth2) {
            auth2.signOut().then(function () {
                currentUser = null;
                updateUiForLogout();
                loadUserData(); // Carga datos de invitado
                loadChatHistory();
            });
        } else {
            throw new Error("Google Auth instance not found.");
        }
    } catch (error) {
        console.error("Error during sign out:", error);
        currentUser = null;
        updateUiForLogout();
        loadUserData();
    }
}

function updateUiForLogin() {
    document.getElementById('g-signin2').style.display = 'none';
    const userProfile = document.getElementById('user-profile');
    userProfile.classList.remove('hidden');
    userProfile.classList.add('flex');
    document.getElementById('user-pic').src = currentUser.imageUrl;
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('logout-button').onclick = signOut;
}

function updateUiForLogout() {
    document.getElementById('g-signin2').style.display = 'block';
    const userProfile = document.getElementById('user-profile');
    userProfile.classList.add('hidden');
    userProfile.classList.remove('flex');
}

// --- Funciones de Datos de Usuario ---
function loadUserData() {
    const key = currentUser ? `userData-${currentUser.email}` : 'userData-guest';
    const userData = localStorage.getItem(key);

    try {
        if (userData) {
            const parsedData = JSON.parse(userData);
            const { age, weight, height } = parsedData;
            
            // Validar que los datos son válidos
            if (age && weight && height && !isNaN(age) && !isNaN(weight) && !isNaN(height)) {
                document.getElementById('age').value = age;
                document.getElementById('weight').value = weight;
                document.getElementById('height').value = height;
            } else {
                throw new Error('Datos de usuario inválidos');
            }
        } else {
            // Valores por defecto
            document.getElementById('age').value = 48;
            document.getElementById('weight').value = 75;
            document.getElementById('height').value = 178;
        }
    } catch (error) {
        console.warn('Error al cargar datos del usuario:', error);
        // Valores por defecto en caso de error
        document.getElementById('age').value = 48;
        document.getElementById('weight').value = 75;
        document.getElementById('height').value = 178;
        
        // Limpiar datos corruptos
        localStorage.removeItem(key);
    }
    calculateMetrics();
}

function saveUserData() {
    const key = currentUser ? `userData-${currentUser.email}` : 'userData-guest';
    const age = document.getElementById('age')?.value;
    const weight = document.getElementById('weight')?.value;
    const height = document.getElementById('height')?.value;
    
    // Validar que los elementos existen y tienen valores válidos
    if (!age || !weight || !height || isNaN(age) || isNaN(weight) || isNaN(height)) {
        console.warn('Datos de usuario inválidos, no se guardará');
        return;
    }
    
    const userData = {
        age: parseFloat(age),
        weight: parseFloat(weight),
        height: parseFloat(height),
        timestamp: new Date().toISOString() // Para depuración
    };
    
    try {
        localStorage.setItem(key, JSON.stringify(userData));
    } catch (error) {
        console.error('Error al guardar datos del usuario:', error);
    }
}

function calculateMetrics() {
    const age = parseFloat(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    
    const caloriesDisplay = document.getElementById('calories-display');
    const proteinDisplay = document.getElementById('protein-display');
    const hydrationDisplay = document.getElementById('hydration-display');

    // Validaciones más estrictas
    const isValidAge = age > 0 && age < 120;
    const isValidWeight = weight > 0 && weight < 500;
    const isValidHeight = height > 0 && height < 300;

    if (isValidAge && isValidWeight && isValidHeight) {
        try {
            // Fórmula BMR de Mifflin-St Jeor para hombres (más conservadora)
            const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
            const maintenanceCalories = bmr * 1.725; // Factor de actividad alta
            const targetCalories = Math.round(maintenanceCalories + 400); // Superávit para ganancia muscular
            const targetProtein = Math.round(weight * 2.0); // 2g por kg de peso corporal
            const targetHydration = (weight * 0.035).toFixed(1); // 35ml por kg

            caloriesDisplay.textContent = targetCalories.toLocaleString('es-MX');
            proteinDisplay.textContent = targetProtein.toLocaleString('es-MX');
            hydrationDisplay.textContent = targetHydration;
            
            // Remover clases de error si existían
            ['age', 'weight', 'height'].forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.classList.remove('border-red-500', 'bg-red-50');
                }
            });
        } catch (error) {
            console.error('Error en cálculo de métricas:', error);
            setDisplaysToDefault(caloriesDisplay, proteinDisplay, hydrationDisplay);
        }
    } else {
        setDisplaysToDefault(caloriesDisplay, proteinDisplay, hydrationDisplay);
        
        // Marcar campos inválidos
        if (!isValidAge) markFieldAsInvalid('age');
        if (!isValidWeight) markFieldAsInvalid('weight');
        if (!isValidHeight) markFieldAsInvalid('height');
    }
    
    // Solo guardar si los datos son válidos
    if (isValidAge && isValidWeight && isValidHeight) {
        saveUserData();
    }
}

function setDisplaysToDefault(caloriesDisplay, proteinDisplay, hydrationDisplay) {
    if (caloriesDisplay) caloriesDisplay.textContent = '--';
    if (proteinDisplay) proteinDisplay.textContent = '--';
    if (hydrationDisplay) hydrationDisplay.textContent = '--';
}

function markFieldAsInvalid(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('border-red-500', 'bg-red-50');
        setTimeout(() => {
            field.classList.remove('border-red-500', 'bg-red-50');
        }, 3000);
    }
}

// --- Funciones del Plan de Entrenamiento ---
function renderWorkoutTable(day) {
    const workoutContainer = document.getElementById('workout-container');
    const dayKey = `day${day}`;
    const data = workoutData[dayKey];
    if (!data || !data.workouts) {
        workoutContainer.innerHTML = '<p>No hay datos de entrenamiento para este día.</p>';
        return;
    }
    
    const dayNumbersToShow = [parseInt(day), parseInt(day) + 3];
    let tableHTML = '';
    dayNumbersToShow.forEach(dayNum => {
        const workoutsForDay = data.workouts.filter(w => w.day === dayNum);
        if (workoutsForDay.length > 0) {
            tableHTML += `
                <table class="w-full text-sm text-left text-slate-500 workout-table active mb-6">
                    <thead class="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th scope="col" class="px-4 py-3">Ejercicio (Día ${dayNum})</th>
                            <th scope="col" class="px-2 py-3 text-center">Series</th>
                            <th scope="col" class="px-2 py-3 text-center">Reps</th>
                            <th scope="col" class="px-2 py-3 text-center">Guía</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            workoutsForDay.forEach(w => {
                tableHTML += `
                    <tr class="bg-white border-b">
                        <td class="px-4 py-4 font-medium text-slate-900">${w.name}<p class="text-xs text-slate-500 font-normal">${w.notes}</p></td>
                        <td class="px-2 py-4 text-center">${w.series}</td>
                        <td class="px-2 py-4 text-center">${w.reps}</td>
                        <td class="px-2 py-4 text-center">
                            <span class="cursor-pointer text-xl" onclick="showGif('${w.gif}')">🖼️</span>
                            <a href="${w.video}" target="_blank" class="ml-2 text-xl">▶️</a>
                        </td>
                    </tr>
                `;
            });
            tableHTML += `</tbody></table>`;
        }
    });
    workoutContainer.innerHTML = tableHTML;
}

window.showGif = function(url) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    modalImg.src = url;
    modal.style.display = "flex";
}

// --- Funciones del Chat con IA ---
function loadChatHistory() {
    const key = currentUser ? `chatHistory-${currentUser.email}` : 'chatHistory-guest';
    const savedHistory = localStorage.getItem(key);
    
    try {
        chatHistory = savedHistory ? JSON.parse(savedHistory) : [];
        
        // Validar que el historial tiene la estructura correcta
        if (!Array.isArray(chatHistory)) {
            throw new Error('Historial de chat inválido');
        }
        
        // Validar cada mensaje
        chatHistory = chatHistory.filter(msg => 
            msg && typeof msg === 'object' && 
            typeof msg.text === 'string' && 
            typeof msg.role === 'string'
        );
    } catch (error) {
        console.warn('Error al cargar historial de chat:', error);
        chatHistory = [];
        localStorage.removeItem(key);
    }
    
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        chatMessages.innerHTML = '';
        chatHistory.forEach(msg => addMessageToUI(msg.text, msg.role));
    }
}

function saveChatHistory() {
    const key = currentUser ? `chatHistory-${currentUser.email}` : 'chatHistory-guest';
    localStorage.setItem(key, JSON.stringify(chatHistory));
}

function addMessageToUI(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageEl = document.createElement('div');
    messageEl.classList.add('p-2', 'rounded-lg', 'mb-2', 'max-w-[80%]');
    
    if(sender === 'ai-typing') {
        messageEl.textContent = 'Escribiendo...';
        messageEl.classList.add('ai-typing');
    } else {
        messageEl.textContent = message;
    }

    if (sender === 'user') {
        messageEl.classList.add('bg-teal-100', 'self-end', 'ml-auto');
    } else {
        messageEl.classList.add('bg-slate-200', 'self-start', 'mr-auto');
    }
    chatMessages.appendChild(messageEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function handleUserMessage(event) {
    event.preventDefault();
    const chatInput = document.getElementById('chat-input');
    const userInput = chatInput.value.trim();
    
    if (!userInput) return;

    // Validar longitud del mensaje
    if (userInput.length > 500) {
        addMessageToUI('Por favor, mantén tu pregunta en menos de 500 caracteres.', 'model');
        return;
    }

    chatHistory.push({ role: 'user', text: userInput });
    addMessageToUI(userInput, 'user');
    saveChatHistory();
    chatInput.value = '';

    addMessageToUI('Escribiendo...', 'ai-typing');
    
    try {
        const aiResponse = await getAIResponse(userInput);
        const typingIndicator = document.querySelector('.ai-typing');
        if(typingIndicator) typingIndicator.remove();
        
        chatHistory.push({ role: 'model', text: aiResponse });
        addMessageToUI(aiResponse, 'model');
        saveChatHistory();
    } catch (error) {
        console.error("Error fetching AI response:", error);
        const typingIndicator = document.querySelector('.ai-typing');
        if(typingIndicator) typingIndicator.remove();
        
        let errorMessage = 'Lo siento, no pude procesar tu solicitud.';
        if (error.message.includes('API Key')) {
            errorMessage = 'El chat con IA no está configurado. La app funciona perfectamente sin esta función.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
            errorMessage = 'Problema de conexión. Verifica tu internet e inténtalo de nuevo.';
        }
        
        addMessageToUI(errorMessage, 'model');
    }
}

async function getAIResponse(prompt) {
  const apiKey = 'AIzaSyDgx7HvPc02OQHGRm_EJKZsTNRqbnLWVZc'; //  AIzaSyDgx7HvPc02OQHGRm_EJKZsTNRqbnLWVZc , AIzaSyCmrlFduxR5ovY3bBGtMIDnSmXsiDU5_9s⚠️ IMPORTANTE: Debes agregar tu API Key de Google AI Studio aquí

  if (!apiKey || apiKey.trim() === '') {
    throw new Error('API Key de Gemini no configurada. Por favor, obtén una API key en https://aistudio.google.com/');
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `Eres un asistente de fitness experto en idioma español. Responde de forma concisa, útil y motivadora. Máximo 200 palabras. Pregunta: "${prompt}"`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error de API (${response.status}): ${errorText}`);
    }

    const result = await response.json();

    if (
      result.candidates &&
      result.candidates.length > 0 &&
      result.candidates[0].content &&
      result.candidates[0].content.parts &&
      result.candidates[0].content.parts.length > 0
    ) {
      return result.candidates[0].content.parts[0].text;
    }

    throw new Error('Respuesta inválida de la API');
  } catch (error) {
    console.error('Error en getAIResponse:', error);
    if (error.message.includes('API Key')) {
      throw new Error('Por favor configura tu API Key de Gemini en el código.');
    }
    throw new Error('Error al conectar con el asistente de IA. Inténtalo más tarde.');
  }
}

// --- Inicialización de la Aplicación ---
function initializeApp() {
    // Verificar que los elementos DOM necesarios existen
    const requiredElements = ['age', 'weight', 'height', 'chat-messages', 'workout-container'];
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length > 0) {
        console.error('Elementos DOM faltantes:', missingElements);
        return;
    }
    
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar data.json: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            workoutData = data;
            
            const ageInput = document.getElementById('age');
            const weightInput = document.getElementById('weight');
            const heightInput = document.getElementById('height');
            
            const navLinks = document.querySelectorAll('.nav-link');
            const contentSections = document.querySelectorAll('.content-section');
            const daySelectors = document.querySelectorAll('.day-selector');
            const chatFab = document.getElementById('chat-fab');
            const chatWindow = document.getElementById('chat-window');
            const chatCloseBtn = document.getElementById('chat-close-btn');
            const chatForm = document.getElementById('chat-form');

            // Configurar modal
            const modalClose = document.querySelector('.modal-close');
            if (modalClose) {
                modalClose.onclick = () => {
                    const modal = document.getElementById('imageModal');
                    if (modal) modal.style.display = "none";
                }
            }
            
            // Event listeners para inputs con validación
            [ageInput, weightInput, heightInput].forEach(input => {
                if(input) {
                    input.addEventListener('input', debounce(calculateMetrics, 300));
                    input.addEventListener('blur', saveUserData);
                }
            });

            // Navegación
            navLinks.forEach(link => {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    const targetId = this.getAttribute('href').substring(1);
                    contentSections.forEach(section => {
                        section.classList.toggle('active', section.id === targetId);
                    });
                });
            });

            // Selectores de día
            daySelectors.forEach(selector => {
                selector.addEventListener('click', function() {
                    daySelectors.forEach(s => s.classList.remove('active'));
                    this.classList.add('active');
                    const targetDay = this.getAttribute('data-day');
                    renderWorkoutTable(targetDay);
                });
            });

            // Chat
            if (chatFab && chatWindow) {
                chatFab.addEventListener('click', () => chatWindow.classList.toggle('hidden'));
            }
            if (chatCloseBtn && chatWindow) {
                chatCloseBtn.addEventListener('click', () => chatWindow.classList.add('hidden'));
            }
            if (chatForm) {
                chatForm.addEventListener('submit', handleUserMessage);
            }
            
            // Chart.js
            const ctx = document.getElementById('macroChart');
            if (ctx && typeof Chart !== 'undefined') {
                try {
                    new Chart(ctx, {
                        type: 'doughnut',
                        data: {
                            labels: ['Carbohidratos', 'Proteínas', 'Grasas'],
                            datasets: [{
                                label: '% de Calorías',
                                data: [45, 30, 25],
                                backgroundColor: ['rgba(20, 184, 166, 0.7)', 'rgba(13, 148, 136, 0.8)', 'rgba(15, 118, 110, 0.9)'],
                                borderColor: ['rgba(20, 184, 166, 1)', 'rgba(13, 148, 136, 1)', 'rgba(15, 118, 110, 1)'],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: (c) => `${c.label}: ${c.parsed}%` } } }
                        }
                    });
                } catch (error) {
                    console.error('Error al crear el gráfico:', error);
                }
            }
            
            // Cargar datos iniciales
            loadUserData();
            loadChatHistory();
            renderWorkoutTable('1');
        })
        .catch(error => {
            console.error('Error al cargar los datos de entrenamiento:', error);
            // Mostrar mensaje de error al usuario
            const workoutContainer = document.getElementById('workout-container');
            if (workoutContainer) {
                workoutContainer.innerHTML = `
                    <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                        <p class="font-semibold">Error al cargar los datos de entrenamiento</p>
                        <p class="text-sm">Por favor, recarga la página o verifica tu conexión.</p>
                    </div>
                `;
            }
        });
}

// Función debounce para optimizar las llamadas
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function initGoogleSignIn() {
    // Verificar que gapi está disponible
    if (typeof gapi === 'undefined') {
        console.warn('Google API no está disponible');
        handleGoogleAuthError({error: 'gapi_not_loaded'});
        return;
    }
    
    try {
        gapi.load('auth2', function() {
            gapi.auth2
              .init({
                client_id: '163032871211-9oq4qs05uk8ao4imkuqvbsuqjd4ui6qu.apps.googleusercontent.com', // ⚠️ Reemplazar con Client ID real
              })
              .then(
                () => {
                  // Verificar que signin2 está disponible
                  if (typeof gapi.signin2 === 'undefined') {
                    throw new Error('gapi.signin2 no está disponible');
                  }

                  const signInElement = document.getElementById('g-signin2');
                  if (signInElement) {
                    gapi.signin2.render('g-signin2', {
                      scope: 'profile email',
                      width: 240,
                      height: 50,
                      longtitle: true,
                      theme: 'dark',
                      onsuccess: onSignIn,
                      onfailure: function (error) {
                        console.error('Error en el signin:', error);
                        handleGoogleAuthError(error);
                      },
                    });
                  } else {
                    console.error('Elemento g-signin2 no encontrado');
                  }
                },
                (error) => {
                  handleGoogleAuthError(error);
                }
              );
        });
    } catch (e) {
        handleGoogleAuthError(e);
    }
}

function handleGoogleAuthError(error) {
    console.error("Error al inicializar Google Sign-In:", JSON.stringify(error, null, 2));
    const authContainer = document.getElementById('auth-container');
    if (authContainer) {
        authContainer.innerHTML = `
            <div class="text-xs text-amber-600 text-right p-2 bg-amber-50 rounded">
                <p>⚠️ Autenticación no disponible</p>
                <p class="text-amber-500">La app funciona sin registro</p>
                <details class="mt-1">
                    <summary class="cursor-pointer">Detalles técnicos</summary>
                    <p class="text-amber-400">Verifica el Client ID de Google</p>
                </details>
            </div>
        `;
    }
    
    // Asegurar que la app funcione en modo invitado
    loadUserData();
    loadChatHistory();
}

// Función global que se llama cuando el script de Google se ha cargado
function onGoogleScriptLoad() {
    initializeApp();
    initGoogleSignIn();
}
