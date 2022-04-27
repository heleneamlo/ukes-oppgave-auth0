let auth0 = null;

const fetchAuthConfig = () => fetch("/auth_config.json");
//oauth0 config
const configureClient = async () => {
    const response = await fetchAuthConfig();
    const config = await response.json();
  
    auth0 = await createAuth0Client({
      domain: config.domain,
      client_id: config.clientId
    });
};
//funksjon som skal sjekke om login for brukeren er cacha på side innlasting
window.onload = async () => {
  
    updateUI();
  
    const isAuthenticated = await auth0.isAuthenticated();
  
    if (isAuthenticated) {
      document.getElementById("gated-content").classList.remove("hidden");
      return;
    }
  
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
  
      await auth0.handleRedirectCallback();
      
      updateUI();
  
      window.history.replaceState({}, document.title, "/");
    }
};
//oppdater user interface
const updateUI = async () => { 
    const isAuthenticated = await auth0.isAuthenticated();
  

    //hvis autentisert fjern klasser gated-content (MIDLERTIDIG)
    if (isAuthenticated) {
      document.getElementById("gated-content").classList.remove("hidden");
    } else {
      document.getElementById("gated-content").classList.add("hidden");
    }
  };
//logg inn funksjon
const login = async () => {
    await auth0.loginWithRedirect({
      redirect_uri: window.location.origin
    });
};
//logg ut funksjon
const logout = () => {
    auth0.logout({
      returnTo: window.location.origin
    });
  };