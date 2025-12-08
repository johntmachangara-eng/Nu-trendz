document.addEventListener("DOMContentLoaded", () => {
  // Same Firebase project as the rest of your site
  const firebaseConfig = {
    apiKey: "AIzaSyBshg3uKI9UK043ItARQhPf4kw4fDqDnkc",
    authDomain: "database-93ee7.firebaseapp.com",
    projectId: "database-93ee7",
    storageBucket: "database-93ee7.firebasestorage.app",
    messagingSenderId: "512064197430",
    appId: "1:512064197430:web:62ca518c67d20f82001997"
  };

  // Init Firebase safely (avoid double-init)
  if (!firebase.apps || !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const auth = firebase.auth();

  // Elements
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const loginBtn = document.getElementById("loginBtn");
  const errorMsg = document.getElementById("errorMsg");
  const form = document.getElementById("loginForm");

  if (!loginBtn || !emailInput || !passwordInput || !form) {
    console.error("Admin login: missing form elements in DOM");
    return;
  }

  function setError(message) {
    errorMsg.textContent = message || "";
  }

  function normaliseError(error) {
    if (!error || !error.code) return "Login failed. Please try again.";

    switch (error.code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Incorrect email or password.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/too-many-requests":
        return "Too many attempts. Please wait a moment and try again.";
      default:
        return error.message || "Login failed. Please try again.";
    }
  }

  function setLoading(isLoading) {
    loginBtn.disabled = isLoading;
    if (isLoading) {
      loginBtn.textContent = "Signing in…";
    } else {
      loginBtn.textContent = "Sign In";
    }
  }

  function handleLogin() {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        // On success, go to admin panel
        window.location.href = "admin-panel.html";
      })
      .catch((err) => {
        console.error("Admin login error:", err);
        setError(normaliseError(err));
        setLoading(false);
      });
  }

  // Button click
  loginBtn.addEventListener("click", handleLogin);

  // Press Enter in any input
  form.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin();
    }
  });
});
