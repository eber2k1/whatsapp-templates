const templatesContainer = document.querySelector("#templates-container");

const title = document.querySelector("#title");
const message = document.querySelector("#message");
const hashTag = document.querySelector("#hashTag");
const link = document.querySelector("#link");
const formTemplate = document.querySelector("#form-template");

const gridorlistModeButton = document.querySelector("#gridorlist-mode-button");
const deleteTemplate = document.querySelector("#delete-template");

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
    }
});

// Evento click para cambiar el modo de visualización
gridorlistModeButton.addEventListener("click", function () {
    templatesContainer.classList.toggle("grid");
    templatesContainer.classList.toggle("list");

    const isGridMode = templatesContainer.classList.contains("grid");
    gridorlistModeButton.innerHTML = isGridMode
        ? `<i class="fas fa-th-list"></i> List Mode`
        : `<i class="fas fa-th-large"></i> Grid Mode`;
});


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


document.addEventListener("DOMContentLoaded", function () {
    window.templatesStore.initializeStore();
});