function showModalConfirm({ title, message, onConfirm }) {
    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-message").textContent = message;

    const confirmBtn = document.getElementById("modal-confirm-btn");

    // Eliminar cualquier handler previo
    const newBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);

    // Añadir el nuevo
    newBtn.addEventListener("click", function () {
        onConfirm();
        closeModal();
    });

    document.getElementById("modal-confirm").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("modal-confirm").classList.add("hidden");
}