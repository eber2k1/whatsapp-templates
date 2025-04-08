// POO

function createStore(initialState = []) {
    // Estado interno de la funcion
    // variable privada
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
        // localStorage.getItem("templates") cuando no existe es un null
        const templates = localStorage.getItem("templates");
        const newTemplates = templates === null ? [] : JSON.parse(templates);
        // re-instanciacion
        const mappedTemplates = newTemplates.map(function (newTemplate) {
          return new Template(
            newTemplate.title,
            newTemplate.message,
            newTemplate.hashTag,
            newTemplate.link,
            newTemplate.date
          );
        });
    
        setState(mappedTemplates);
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