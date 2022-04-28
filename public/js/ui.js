// URL mapping, fra hash til en funksjon som svarer på den url handlingen
const router = {
    "/": () => showContent("content-home"),
    "/profile": () =>
      requireAuth(() => showContent("content-profile"), "/profile"),
    "/login": () => login()
  };
  
  //hjelper funksjoner
  
  //går over elemener som matcher "selector og gir dem til fn"
  const eachElement = (selector, fn) => {
    for (let e of document.querySelectorAll(selector)) {
      fn(e);
    }
  };
  
  //prøver å vise et panel som er referert til av den spesifiserte URL en, disse matches ved å bruke ruteren, definert ovenfor.
  const showContentFromUrl = (url) => {
    if (router[url]) {
      router[url]();
      return true;
    }
  
    return false;
  };
  
  //Returnerer true hvis `element` er en hyperlink som kan regnes som en link til en annen SPA rute
  const isRouteLink = (element) =>
    element.tagName === "A" && element.classList.contains("route-link");
  
//viser et panel som har class page
   const showContent = (id) => {
    eachElement(".page", (p) => p.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
  };
  
//oppdaterer UI
  const updateUI = async () => {
    try {
      const isAuthenticated = await auth0.isAuthenticated();
  
      if (isAuthenticated) {
        const user = await auth0.getUser();
        document.querySelectorAll("pre code").forEach(hljs.highlightBlock);
        eachElement(".auth-invisible", (e) => e.classList.add("hidden"));
        eachElement(".auth-visible", (e) => e.classList.remove("hidden"));
      } else {
        eachElement(".auth-invisible", (e) => e.classList.remove("hidden"));
        eachElement(".auth-visible", (e) => e.classList.add("hidden"));
      }
    } catch (err) {
      console.log("Error updating UI!", err);
      return;
    }
  
    console.log("UI updated");
  };
  //sjekker om aktiv historie endrer seg
  window.onpopstate = (e) => {
    if (e.state && e.state.url && router[e.state.url]) {
      showContentFromUrl(e.state.url);
    }
  };
  