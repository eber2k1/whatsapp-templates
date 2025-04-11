const colors = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-yellow-400 text-black",
    info: "bg-sky-500 text-white",
  };
  
  /**
   * @param {"success"|"error"|"warning"|"info"} type
   * @param {string} title
   * @param {string} message
   * @returns {HTMLElement}
   */
  function createHTMLNotification(type, title, message) {
    const wrapper = document.createElement("div");
    wrapper.className = `
      fixed inset-x-0 top-0 z-50 w-full max-w-sm md:max-w-md lg:top-3 lg:right-3 lg:left-auto
      mx-auto rounded-xl px-4 py-3 shadow-lg border transition-all duration-300
      ${colors[type]} notification
    `;
  
    wrapper.innerHTML = `
      <div class="flex items-start justify-between gap-2">
        <div class="flex-grow overflow-hidden">
          <h5 class="font-bold text-lg truncate">${title}</h5>
          <p class="mt-1 text-sm md:text-base break-words">${message}</p>
        </div>
        <button class="ml-2 flex-shrink-0 text-white/80 hover:text-white" onclick="dismissNotification(this)">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
  
    return wrapper;
  }
  
  function dismissNotification(button) {
    const notification = button.closest(".notification");
    notification.classList.add("opacity-0", "-translate-y-10");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }
  
  /**
   * Muestra una notificación
   * @param {"success"|"error"|"warning"|"info"} type
   * @param {string} title
   * @param {string} message
   * @param {number} duration en milisegundos, 0 para permanente
   */
  function showNotification(type, title, message, duration = 3000) {
    const notification = createHTMLNotification(type, title, message);
    notification.classList.add("transform", "-translate-y-10", "opacity-0");
  
    document.body.appendChild(notification);
  
    requestAnimationFrame(() => {
      notification.classList.remove("-translate-y-10", "opacity-0");
      notification.classList.add("translate-y-0", "opacity-100");
    });
  
    if (duration > 0) {
      setTimeout(() => {
        notification.classList.add("opacity-0", "-translate-y-10");
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, duration);
    }
  }
  