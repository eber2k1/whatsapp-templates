function saveTemplates() {
    // tenemos acceso al store?
    // window.templatesStore.getState()
    localStorage.setItem(
      "templates",
      JSON.stringify(window.templatesStore.getState())
    );
  }
  function ResetTemplates() {
    localStorage.clear();
    window.templatesStore.initializeStore();
  }