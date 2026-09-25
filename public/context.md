# CONTEXTO DEL PROYECTO: CYBER-PET // NEXUS (SISTEMA AVANZADO)

## 1. Descripción General
**Cyber-Pet: Nexus** es una simulación de mascota virtual con temática cyberpunk y arquitectura web moderna (HTML5, Tailwind CSS, JavaScript ES Modules, Firebase Firestore y Authentication). El juego combina la gestión de recursos de supervivencia metabólica en tiempo real con un ecosistema social multicategoría (Chat Global, Leaderboard y Mercado P2P).

---

## 2. Estadísticas Vitales (Stats) y Rangos
Todas las estadísticas principales operan en una escala porcentual de **0 a 100%**:

*   **Salud (Integridad):** Representa la vida útil del chasis. Si llega a 0%, se produce un colapso total del nodo y reinicio de estadísticas. Se regenera lentamente si el hambre y la sed están estables (>50%).
*   **Hambre:** Metabolismo alimentario. Desciende de forma constante con el tiempo y se acelera por factores externos (baja felicidad o exceso de actividad).
*   **Sed (Refrigerante):** Nivel de refrigeración del sistema. Drena de manera constante.
*   **Sueño (Energía):** Nivel energético de la IA. Se agota con las acciones, el entrenamiento o el paso del tiempo, y se recupera mediante la tarea de sueño o bebidas energéticas.
*   **Felicidad (Fun):** Estado anímico. Es crucial para evitar la melancolía y mantener la estabilidad metabólica.
*   **Higiene (Limpieza):** Mantenimiento del chasis. Sustituye al concepto clásico de "virus"; requiere higienización periódica para evitar fallos de sistema.
*   **Depresión:** Sistema de estados anidados con 3 niveles:
    *   `0`: Estable.
    *   `1`: Melancolía Leve.
    *   `2`: Depresión Severa (genera un drenaje acelerado de felicidad).

---

## 3. Interdependencias Matemáticas y Cruce de Estadísticas
El juego implementa una matriz de influencias cruzadas que simulan un ecosistema orgánico-cibernético:

1.  **Impacto de la Felicidad en el Metabolismo:**
    *   Si `Felicidad < 30`, el drenaje base de *Hambre* aumenta en `+2` unidades por ciclo y el drenaje de *Energía* aumenta en `+2` unidades adicionales.
2.  **Génesis de la Depresión:**
    *   Si la mascota mantiene su *Energía > 90* de forma inactiva mientras su *Felicidad < 40*, el nivel de depresión aumenta de forma progresiva.
    *   Si la *Felicidad > 70*, la depresión disminuye gradualmente.
    *   La depresión activa incrementa el consumo de felicidad en `+3` por cada grado de depresión por ciclo.
3.  **Penalidad por Sobrealimentación:**
    *   Si el jugador intenta alimentar a la mascota cuando su *Hambre >= 95*, se genera una congestión metabólica que reduce la *Salud* en `-10%`.
4.  **Eventos Aleatorios Críticos (Hambre Extrema):**
    *   Si el *Hambre < 25* y el usuario **no posee alimentos** en su mochila, existe un `40%` de probabilidad por ciclo de ejecución de que la mascota busque restos en la basura:
        *   Efecto: `-15% Salud` y `-20% Higiene`, acompañado de un registro de advertencia en el log.
5.  **Progresión de Nivel y Experiencia:**
    *   La experiencia necesaria para subir de nivel se calcula dinámicamente como: $\text{Experiencia Requerida} = \text{Nivel Actual} \times 60$.
    *   Los hitos de nivel modifican el avatar visual (`🤖` Novato, `🦊` Iniciado/Avanzado, `🐉` Maestro Cuántico con Nivel >= 5).

---

## 4. Mochila Avanzada y Sistema de Ítems
El sistema elimina los botones directos genéricos de consumo para pasar a un **inventario clasificado**:
*   **Tipos de Ítems:** `food` (Comida), `drink` (Bebida), `med` (Medicina).
*   **Selectores Modales:** Al pulsar "Alimentar" o "Refrigerar", se abre un modal interactivo que lee el array `petState.inventory`, permitiendo al usuario elegir estratégicamente qué consumir según el rendimiento del ítem (ej. *Cibersnack Básico*, *Nutri-Pasta Cuántica*, *Bento Gourmet*, *Refrigerante Estándar*, *Ion Water*, *Quantum Energy Soda*, *Nanobots Médicos*).

---

## 5. Actividades, Tareas Progresivas y Entrenamiento
*   **Tareas Progresivas con Interrupción:** Acciones como *Dormir*, *Higienizar* o entrenar se ejecutan mediante un bucle de intervalo (`setInterval` a 100ms) que actualiza una barra de progreso visual. El usuario cuenta con un botón de **CANCELAR** para abortar la tarea en curso.
*   **Centro de Entretenimiento (Jugar):** Actividades lúdicas (*Holographic Fetch*, *Synth-Ball*, *Neural Dance*) diseñadas para recuperar grandes cantidades de felicidad a cambio de un coste moderado de energía.
*   **Centro de Entrenamiento:**
    *   *Cardio (Correr):* Consume energía y sed; otorga Shards y XP.
    *   *Lectura (Estudiar):* Estímulo cognitivo y recreativo.
    *   *Gym (Fuerza):* Entrenamiento intenso que gasta energía, hambre y sed de manera simultánea a cambio de alta recompensa en Shards y XP.

---

## 6. Arquitectura Cloud y Multijugador (Firebase)
*   **Persistencia:** Sincronización automática de `petState` en Firestore bajo la colección `pets/{uid}`.
*   **Leaderboard Multicategoría:** Permite filtrar y ordenar nodos globales por *Tiempo Vivo (Días)* o *Nivel*.
*   **Mercado P2P Global:** Sistema de órdenes donde los usuarios pueden publicar ítems o recursos por una cantidad específica de Shards para que otros jugadores los adquieran.
*   **Chat Global:** Canal en tiempo real con indicador de mensajes no leídos (badge flotante).






Detalle de Herramientas y Tecnologías Utilizadas
1. Interfaz y Estructura (Frontend)
HTML5: Estructura base de la aplicación (SPA). Organiza de manera dinámica la pantalla de autenticación, el panel de control principal, los modales interactivos (mochila avanzada, tienda, mercado P2P) y el cajón de chat lateral.

Tailwind CSS (v3): Framework CSS basado en utilidades cargado mediante CDN. Configurado con una paleta de colores personalizada de temática cyberpunk (tonos oscuros y acentos en cian, azul y morado neón) para lograr un diseño responsivo y efectos visuales avanzados como resplandores (neon-glow) y bordes lumínicos (neon-border).

JavaScript (ES Modules): Núcleo lógico del cliente. Utiliza módulos estándar de ECMAScript (import/export), funciones asíncronas (async/await), gestión de estado reactivo local y bucles temporizados para controlar el motor metabólico y las tareas progresivas con opción de cancelación en tiempo real.

2. Infraestructura y Base de Datos (Backend as a Service - Firebase 10.8.0)
Firebase Authentication: Maneja el sistema de registro y acceso de operadores mediante credenciales, adaptando de manera transparente un nombre de usuario personalizado a un formato de correo interno (@nexus-game.internal).

Cloud Firestore: Base de datos NoSQL en la nube que soporta la persistencia de los datos del juego y las funciones sociales en tiempo real:

pets/{uid}: Almacena la telemetría vital, nivel, experiencia, Shards e inventario de la mochila de cada usuario.

global_chat: Colección para los mensajes del chat global entre jugadores.

market_listings: Almacena las publicaciones e intercambio de ítems del Mercado P2P.

Sincronización en Tiempo Real (onSnapshot): Utilizada para escuchar cambios en la base de datos al instante, permitiendo que el ranking global (Leaderboard), el mercado y el chat multijugador se actualicen en vivo para todos los nodos conectados.

3. Tipografía y Estética Visual
Google Fonts:

Orbitron: Tipografía geométrica y futurista aplicada a los títulos, cabeceras y nombres principales para reforzar la atmósfera tecnológica y espacial.

Share Tech Mono: Tipografía monoespaciada aplicada en la telemetría, los logs del sistema, la mochila y los chats, emulando la interfaz de una terminal de comandos o consola de nave espacial.