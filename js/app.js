    /**
     * Aplicación Gestor de Plantillas
     * Esta aplicación gestiona una colección de plantillas con operaciones CRUD
     * y diferentes modos de visualización.
     */

    // Referencias a elementos del DOM
    const templatesContainer = document.querySelector("#templates-container");

    // Elementos del formulario para crear nuevas plantillas
    const title = document.querySelector("#title");
    const message = document.querySelector("#message");
    const hashTag = document.querySelector("#hashTag");
    const link = document.querySelector("#link");
    const formTemplate = document.querySelector("#form-template");

    // Formulario para actualizar plantillas existentes
    const updateTemplateForm = document.querySelector("#update-template-form");
    const cancelUpdate = document.querySelector("#cancel-update");
        
    // Elementos de control de la interfaz
    const gridorlistModeButton = document.querySelector("#gridorlist-mode-button");
    const resetTemplates = document.querySelector("#reset-templates");

    // Elementos del modal para diálogos de confirmación
    const deleteModal = document.getElementById("deleteModal");
    const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

    // Variables de estado
    let templateTitleToDelete = null;

    /**
     * ==================================
     * FUNCIONES DE RENDERIZADO DE PLANTILLAS
     * ==================================
     */

    /**
     * Renderiza todas las plantillas del almacén en el DOM
     * Crea una representación visual en forma de tarjeta para cada plantilla
     */
    function renderTemplates() {
        templatesContainer.innerHTML = "";

        // Obtener plantillas del almacén
        const templates = window.templatesStore.getState();

        templates.forEach(function (template) {
            const li = document.createElement("li");
            li.classList.add("bg-white", "p-6", "my-4", "rounded-2xl", "shadow-md", "hover:shadow-lg", "transition-shadow", "border", "border-gray-100");
        
            const contentWrapper = document.createElement("div");
            contentWrapper.classList.add("flex", "flex-col", "gap-3");
        
            const header = document.createElement("div");
            header.classList.add("flex", "items-center", "justify-between");
        
            const h4 = document.createElement("h4");
            h4.classList.add("text-xl", "font-bold", "text-gray-800", "overflow-y-auto", "pr-1", "break-words", "whitespace-normal");
            h4.textContent = template.title;
        
            const buttonGroup = document.createElement("div");
            buttonGroup.classList.add("flex", "gap-2");
        
            const updateTemplate = document.createElement("button");
            updateTemplate.classList.add(
                "update-template", "text-white", "bg-green-500", "hover:bg-green-600", "rounded-lg", "px-3", "py-1.5", "text-sm", "transition-colors", "shadow"
            );
            updateTemplate.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
            updateTemplate.title = "Editar";
            updateTemplate.dataset.title = template.title;
        
            const deleteTemplate = document.createElement("button");
            deleteTemplate.classList.add(
                "delete-template", "text-white", "bg-red-500", "hover:bg-red-600", "rounded-lg", "px-3", "py-1.5", "text-sm", "transition-colors", "shadow"
            );
            deleteTemplate.innerHTML = `<i class="fa-solid fa-trash"></i>`;
            deleteTemplate.title = "Eliminar";
            deleteTemplate.dataset.title = template.title;
        
            buttonGroup.appendChild(updateTemplate);
            buttonGroup.appendChild(deleteTemplate);
            header.appendChild(h4);
            header.appendChild(buttonGroup);
        
            const hr = document.createElement("hr");
            hr.classList.add("my-2", "border-gray-200");
        
            const message = document.createElement("p");
            message.classList.add("max-h-32", "overflow-y-auto", "pr-1", "break-words", "whitespace-normal");
            message.textContent = template.message;
        
            const hashTag = document.createElement("p");
            hashTag.classList.add("text-sm", "text-green-700", "font-semibold");
            hashTag.textContent = `#${template.hashTag}`;
        
            const link = document.createElement("a");
            link.classList.add("text-sm", "text-blue-500", "hover:underline", "break-all");
            link.href = template.link;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = template.link;
        
            const date = document.createElement("p");
            date.classList.add("text-xs", "text-gray-400");
            date.textContent = `Creado el: ${template.date}`;
        
            contentWrapper.appendChild(header);
            contentWrapper.appendChild(hr);
            contentWrapper.appendChild(message);
            contentWrapper.appendChild(hashTag);
            contentWrapper.appendChild(link);
            contentWrapper.appendChild(date);
        
            li.appendChild(contentWrapper);
            templatesContainer.appendChild(li);
        });
    }

    /**
     * Muestra un mensaje de estado vacío cuando no existen plantillas
     * Ayuda a proporcionar retroalimentación al usuario cuando la lista de plantillas está vacía
     */
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

    /**
     * ==================================
     * MANEJADORES DE EVENTOS
     * ==================================
     */

    /**
     * Maneja el envío del formulario para agregar una nueva plantilla
     * Recopila datos del formulario, crea un nuevo objeto Template y lo agrega al almacén
     */
    formTemplate.addEventListener("submit", function (e) {
        e.preventDefault();
        const now = new Date();
        // Formatear fecha y hora
        const today = now.toISOString().split("T")[0];
        const time = now.toTimeString().split(" ")[0];
        const dateTime = `${today} ${time}`;
        
        window.templatesStore.addTemplate(
            new Template(title.value, message.value, hashTag.value, link.value, dateTime)
        );

        // Resetear formulario
        formTemplate.reset();
        showNotification("success", "Plantilla guardada", "Plantilla guardada correctamente.");
    });

    /**
     * Maneja el envío del formulario de actualización de plantillas
     * Actualiza una plantilla existente con nuevos valores
     */
    updateTemplateForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const originalTitle = updateTemplateForm.dataset.originalTitle;

        const updatedTemplate = new Template(
            updateTemplateForm.querySelector("#update-title").value,
            updateTemplateForm.querySelector("#update-message").value,
            updateTemplateForm.querySelector("#update-hashTag").value,
            updateTemplateForm.querySelector("#update-link").value,
            new Date().toISOString().replace("T", " ").split(".")[0]
        );

        window.templatesStore.updateTemplate(originalTitle, updatedTemplate);
        showNotification("success", "Plantilla actualizada", "La plantilla fue actualizada correctamente.");

        // Ocultar formulario de actualización y mostrar formulario de creación
        updateTemplateForm.classList.add("hidden");
        document.getElementById("section-form-template").classList.remove("hidden");

        // Resetear formulario
        updateTemplateForm.reset();
    });

    /**
     * Maneja el clic en el botón de cancelar actualización
     * Oculta el formulario de actualización y muestra el formulario de creación
     */
    cancelUpdate.addEventListener("click", function () {
        updateTemplateForm.classList.add("hidden");
        document.getElementById("section-form-template").classList.remove("hidden");
        updateTemplateForm.reset();
    });

    /**
     * Maneja clics en las tarjetas de plantillas para editar o eliminar una plantilla
     * Utiliza delegación de eventos para capturar clics en botones de edición y eliminación
     */
    templatesContainer.addEventListener("click", function (e) {
        // Manejar clic en botón de eliminar plantilla
        if (e.target.classList.contains("delete-template")) {
            const templateTitle = e.target.dataset.title;
            
            showModalConfirm({
                title: "¿Eliminar plantilla?",
                message: "Esta acción no se puede deshacer.",
                onConfirm: () => {
                    window.templatesStore.deleteTemplate(templateTitle);
                    showNotification("success", "Plantilla eliminada", "Plantilla eliminada correctamente.");
                }
            });
        }
        
        // Manejar clic en botón de actualizar plantilla
        if (e.target.classList.contains("update-template") || e.target.closest(".update-template")) {
            const button = e.target.closest(".update-template");
            const templateTitle = button.dataset.title;

            // Buscar la plantilla a editar
            const template = window.templatesStore.getState().find(t => t.title === templateTitle);
            if (!template) return;

            // Mostrar formulario de actualización y ocultar formulario de creación
            document.getElementById("section-form-template").classList.add("hidden");
            updateTemplateForm.classList.remove("hidden");

            // Rellenar campos del formulario de actualización
            updateTemplateForm.dataset.originalTitle = template.title; // Guardar título original
            updateTemplateForm.querySelector("#update-title").value = template.title;
            updateTemplateForm.querySelector("#update-message").value = template.message;
            updateTemplateForm.querySelector("#update-hashTag").value = template.hashTag;
            updateTemplateForm.querySelector("#update-link").value = template.link;
        }
    });

    /**
     * Maneja el clic en el botón de reiniciar plantillas
     * Muestra un diálogo de confirmación antes de eliminar todas las plantillas
     */
    resetTemplates.addEventListener("click", function () {
        showModalConfirm({
            title: "¿Eliminar todas las plantillas?",
            message: "Esta acción eliminará todas las plantillas permanentemente.",
            onConfirm: () => {
                ResetTemplates();
                showNotification("success", "Plantillas eliminadas", "Todas las plantillas fueron eliminadas.");
            }
        });
    });

    /**
     * Maneja el cambio entre modos de visualización en cuadrícula y lista
     * Actualiza la interfaz de usuario para reflejar el modo de visualización seleccionado
     */
    gridorlistModeButton.addEventListener("click", function () {
        const isGridMode = templatesContainer.classList.contains("grid");

        if (isGridMode) {
            // Cambiar a modo lista
            templatesContainer.classList.remove("grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3");
            templatesContainer.classList.add("flex", "flex-col");
            gridorlistModeButton.innerHTML = `<i class="fas fa-th-large"></i> Grid Mode`;
        } else {
            // Cambiar a modo cuadrícula
            templatesContainer.classList.remove("flex", "flex-col");
            templatesContainer.classList.add("grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3");
            gridorlistModeButton.innerHTML = `<i class="fas fa-th-list"></i> List Mode`;
        }
    });

    /**
     * ==================================
     * INICIALIZACIÓN DE LA APLICACIÓN
     * ==================================
     */

    /**
     * Inicializa la aplicación cuando el DOM está completamente cargado
     * Configura las suscripciones al almacén y carga los datos iniciales
     */
    document.addEventListener("DOMContentLoaded", function () {
        // Suscribirse a los cambios del almacén
        window.templatesStore.suscribe(saveTemplates);
        window.templatesStore.suscribe(renderTemplates);
        window.templatesStore.suscribe(templateEmpty);
        
        // Inicializar el almacén
        window.templatesStore.initializeStore();
    });