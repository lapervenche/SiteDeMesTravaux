const themeSwitcher = {
    _scheme: "auto",
    menuTarget: "details[role='list']",
    buttonsTarget: "a[data-theme-switcher]",
    buttonAttribute: "data-theme-switcher",
    rootAttribute: "data-theme",
    localStorageKey: "picoPreferredColorScheme",
      init() {
      this.scheme = this.schemeFromLocalStorage;
      this.initSwitchers();
    },
      get schemeFromLocalStorage() {
      if (typeof window.localStorage !== "undefined") {
        if (window.localStorage.getItem(this.localStorageKey) !== null) {
          return window.localStorage.getItem(this.localStorageKey);
        }
      }
      return this._scheme;
    },
      get preferredColorScheme() {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    },
      initSwitchers() {
      const buttons = document.querySelectorAll(this.buttonsTarget);
      buttons.forEach((button) => {
        button.addEventListener(
          "click",
          (event) => {
            event.preventDefault();
            this.scheme = button.getAttribute(this.buttonAttribute);
            document.querySelector(this.menuTarget).removeAttribute("open");
          },
          false
        );
      });
    },
      set scheme(scheme) {
      if (scheme == "auto") {
        this.preferredColorScheme == "dark" ? (this._scheme = "dark") : (this._scheme = "light");
      } else if (scheme == "dark" || scheme == "light") {
        this._scheme = scheme;
      }
      this.applyScheme();
      this.schemeToLocalStorage();
    },
      get scheme() {
      return this._scheme;
    },
      applyScheme() {
      document.querySelector("html").setAttribute(this.rootAttribute, this.scheme);
    },
      schemeToLocalStorage() {
      if (typeof window.localStorage !== "undefined") {
        window.localStorage.setItem(this.localStorageKey, this.scheme);
      }
    },
  };
  themeSwitcher.init();