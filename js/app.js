const templatesContainer = document.querySelector("#templates-container");

const title = document.querySelector("#title");
const message = document.querySelector("#message");
const hashTag = document.querySelector("#hashTag");
const link = document.querySelector("#link");
const formTemplate = document.querySelector("#form-template");

const gridorlistModeButton = document.querySelector("#gridorlist-mode-button");
const resetTemplates = document.querySelector("#reset-templates");
const deleteTemplate = document.querySelector("#delete-template");


/*
EVENTOS
*/
// Evento submit del formulario para agregar una nueva plantilla
formTemplate.addEventListener("submit", function (e) {
    e.preventDefault();
    const now = new Date();
    // Formatear la fecha y hora
    const today = now.toISOString().split("T")[0];
    // Formatear la hora
    const time = now.toTimeString().split(" ")[0];
    // Combinar la fecha y hora
    const dateTime = `${today} ${time}`;
    window.templatesStore.addTemplate(
        new Template(title.value, message.value, hashTag.value, link.value, dateTime)
    );
});

// Evento click para eliminar plantilla
templatesContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-template")) {
        const templateTitle = e.target.dataset.title; // Obtener el título del template
        window.templatesStore.deleteTemplate(templateTitle);

        // Mostrar alerta de éxito
        const alertContainer = document.querySelector("#alert-container");
        alertContainer.classList.remove("hidden");
        alertContainer.textContent = "Plantilla eliminada correctamente.";

        // Ocultar la alerta después de 3 segundos
        setTimeout(() => {
            alertContainer.classList.add("hidden");
        }, 3000);
    }
});

// Evento click para borrar plantillas
resetTemplates.addEventListener("click", function() {
    ResetTemplates();
    const alertContainer = document.querySelector("#alert-Templates-delete");
    alertContainer.classList.remove("hidden");
    alertContainer.textContent = "Plantillas eliminadas correctamente.";
    setTimeout(() => {
      alertContainer.classList.add("hidden");
    }, 3000);
});

// Evento click para cambiar el modo de visualización
gridorlistModeButton.addEventListener("click", function () {
    const isGridMode = templatesContainer.classList.contains("grid");

    if (isGridMode) {
        // Cambiar a modo lista
        templatesContainer.classList.remove("grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3");
        templatesContainer.classList.add("flex", "flex-col");
        gridorlistModeButton.innerHTML = `<i class="fas fa-th-large"></i> Grid Mode`;
    } else {
        // Cambiar a modo grid
        templatesContainer.classList.remove("flex", "flex-col");
        templatesContainer.classList.add("grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3");

        gridorlistModeButton.innerHTML = `<i class="fas fa-th-list"></i> List Mode`;
    }
});


/* 
FUNCIONES INDEPENDIENTES
*/

// Mensaje de plantillas vacía

function templateEmpty() {
    const templates = window.templatesStore.getState();

    if (templates.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No hay plantillas disponibles";
        emptyMessage.classList.add(
            "text-center",         
            "lg:text-5xl",        
            "text-gray-700",       
            "font-semibold",       
            "bg-yellow-100",      
            "border",              
            "border-yellow-500",   
            "px-8",                
            "py-6",               
            "rounded-lg",         
            "shadow-xl",          
            "mx-auto",            
            "w-max"             
        );

        templatesContainer.classList.remove("grid", "list");
        templatesContainer.classList.add("flex", "items-center", "justify-center", "md:h-1/2");
        templatesContainer.appendChild(emptyMessage);
    } else {
        templatesContainer.classList.remove("flex", "items-center", "justify-center", "md:h-1/2");
      }
}

// Función para renderizar las plantillas
function renderTemplates() {
    templatesContainer.innerHTML = "";

    // traer la lista de templates desde el store
    const templates = window.templatesStore.getState();

    templates.forEach(function (template) {
        const li = document.createElement("li"); // li
        li.classList.add("bg-white", "p-4", "my-3", "rounded");
        const h4 = document.createElement("h4");
        h4.classList.add("text-xl", "font-semibold");
        h4.textContent = template.title;
        const hr = document.createElement("hr");
        hr.classList.add("block", "my-3");
        const message = document.createElement("p");
        message.classList.add("text-md", "text-gray-500");
        message.textContent = template.message;
        const hashTag = document.createElement("p");
        hashTag.classList.add("text-sm", "mt-3", "text-green-800", "font-bold");
        hashTag.textContent = template.hashTag;
        const link = document.createElement("a");
        link.classList.add("text-sm", "mt-3", "text-green-500", "hover:text-green-700");
        link.href = template.link;
        link.textContent = template.link;
        const date = document.createElement("p");
        date.classList.add("text-sm", "mt-3", "text-green-800");
        date.textContent = template.date;
        const deleteTemplate = document.createElement("button");
        deleteTemplate.classList.add(
            "delete-template","text-sm","mt-3","text-white","bg-red-500","hover:bg-red-700","focus:outline-none","focus:ring-2","focus:ring-red-500","border","border-red-200","rounded-lg","shadow-lg","transition-all","px-4","py-2","text-center","font-medium","hover:text-white","active:bg-red-800"
        );
        deleteTemplate.textContent = "Eliminar";
        deleteTemplate.dataset.title = template.title; // Agregar data-attribute
        li.appendChild(h4);
        li.appendChild(hr);
        li.appendChild(message);
        li.appendChild(hashTag);
        li.appendChild(link);
        li.appendChild(date);
        li.appendChild(deleteTemplate);
        templatesContainer.appendChild(li);
    });
}

window.templatesStore.suscribe(renderTemplates);
window.templatesStore.suscribe(templateEmpty);
window.templatesStore.suscribe(saveTemplates);


document.addEventListener("DOMContentLoaded", function () {
	window.templatesStore.initializeStore();
});