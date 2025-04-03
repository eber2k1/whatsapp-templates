// POO

function createStore(initialState = []) {
    // Estado interno de la funcion
    // variable privda
    let state = initialState; // por defecto es un []

    // arreglo de funciones que se ejecutan cuando el estado cambia
    const listeners = [];

    function getState() {
        return state;
    }

    function setState(newState) {
        state = newState;

        // se ejecuta cuando el estado cambia, por ende yo debo llamar a las funciones
        // que existen dentro de listeners

        // forEach
        listeners.forEach(function (listener) {
            listener(state);
        });
    }

    // Agrega un nuevo template
    function addTemplate(newTemplate) {
        // ... => spread operator
        const newState = [...state, newTemplate];

        setState(newState);
    }

    // Elimina un template
    function deleteTemplate(templateTitle) {
        const templates = getState();
        const newState = templates.filter((t) => t.title !== templateTitle);
        setState(newState);
    }

    // Suscribe un listener
    function suscribe(listener) {
        listeners.push(listener);
        return () => {
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }

    // Inicializa el store con plantillas por defecto
    function initializeStore() {
        const newTemplates = [
            new Template(
                "Bienvenida",
                "¡Hola! 👋 Bienvenido al curso de programación funcional. ¡Estamos felices de que te unas! 😃",
                "#Bienvenida, #Curso, #Programación",
                "https://www.ejemplo.com/curso-bienvenida",
                new Date().toISOString()
            ),
            new Template(
                "Oferta Especial",
                "🎉 ¡Oferta especial! Aprovecha esta promoción exclusiva solo por este mes. ¡No te lo pierdas! 🏷️",
                "#Oferta, #Descuento, #Abril",
                "https://www.ejemplo.com/oferta-especial",
                new Date().toISOString()
            ),
            new Template(
                "Recordatorio de Pago",
                "⏰ ¡Recordatorio! El pago para el curso vence en 3 días. No olvides realizarlo para no perder tu lugar.",
                "#Recordatorio, #Pago, #Curso",
                "https://www.ejemplo.com/recordatorio-pago",
                new Date().toISOString()
            ),
            new Template(
                "Notificación de Envío",
                "📦 ¡Tu pedido ha sido enviado! Estimamos que llegará en 5-7 días hábiles. ¡Gracias por tu compra! 😊",
                "#Envío, #Pedido, #Compra",
                "https://www.ejemplo.com/seguimiento-envio",
                new Date().toISOString()
            ),
            new Template(
                "Encuesta de Satisfacción",
                "📝 ¡Queremos saber tu opinión! Por favor, dedica unos minutos para completar nuestra encuesta de satisfacción. 🤔",
                "#Encuesta, #Opinión, #Satisfacción",
                "https://www.ejemplo.com/encuesta-satisfaccion",
                new Date().toISOString()
            )
        ];


        setState(newTemplates);
    }

    return {
        getState,
        setState,
        addTemplate,
        deleteTemplate,
        suscribe,
        initializeStore,
    };
}

const templatesStore = createStore([]);

window.templatesStore = templatesStore;