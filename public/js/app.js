let auth0 = null;

const fetchAuthConfig = () => fetch("/auth_config.json");

const configureClient = async () => {
    const response = await fetchAuthConfig();
    const config = await response.json();
  
    auth0 = await createAuth0Client({
      domain: config.domain,
      client_id: config.clientId
    });
};

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

const updateUI = async () => { 
    const isAuthenticated = await auth0.isAuthenticated();
  

    
    if (isAuthenticated) {
      document.getElementById("gated-content").classList.remove("hidden");
    } else {
      document.getElementById("gated-content").classList.add("hidden");
    }
  };

const login = async () => {
    await auth0.loginWithRedirect({
      redirect_uri: window.location.origin
    });
};

const logout = () => {
    auth0.logout({
      returnTo: window.location.origin
    });
  };