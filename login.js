const SUPABASE_URL = "https://bfihgfaijaxktljjtvfo.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmaWhnZmFpamF4a3Rsamp0dmZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzOTU3NjYsImV4cCI6MjA1NDk3MTc2Nn0.Nu2WoGRaJuLi-ovBrVkUpZCJ3tCHzc76TmcBDBHsUfk";

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

// login.js
async function loginUsuario(event) {
  event.preventDefault(); // Prevent form submission

  // Get form values
  const usuario = document.getElementById("username").value;
  const contrasena = document.getElementById("password").value;

  if (!usuario || !contrasena) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  try {
    // Fetch user data
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/usuarios?correo=eq.${usuario}&contrasena=eq.${contrasena}`,
      {
        method: "GET",
        headers: headers,
      }
    );

    const data = await response.json();

    if (data.length > 0) {
      const user = data[0]; // Get the first matching user
      const userId = user.id_usuario; // Get the user ID
      const userName = user.nombre; // Get the user's name

      // Save the user ID and name in localStorage
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);

      // Fetch and update the user role
      const userRole = await fetchUserRole(userId);
      console.log("Rol del usuario:", userRole);

      // Update the navbar based on the role
      updateNavbarBasedOnRole();

      alert("¡Inicio de sesión exitoso!");
      window.location.href = "Index.html"; // Redirect to the home page
    } else {
      alert("Usuario o contraseña incorrectos.");
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("Hubo un error al iniciar sesión. Intenta nuevamente.");
  }
}

// After successful login
async function fetchUserRole(userId) {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/usuarios?select=*,roles(nombre_rol)&id_usuario=eq.${userId}`,
      {
        method: "GET",
        headers: headers,
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener el rol del usuario");
    }

    const data = await response.json();
    console.log("API Response:", data);

    if (data.length > 0) {
      const userRole = data[0].roles.nombre_rol; // Get the role name
      localStorage.setItem("userRole", userRole); // Store the role in localStorage
      console.log("Local Storage Updated:", localStorage.getItem("userRole"));
      return userRole;
    } else {
      throw new Error("Usuario no encontrado");
    }
  } catch (error) {
    console.error("Error al obtener el rol del usuario:", error);
    alert("Hubo un error al obtener el rol del usuario. Intenta nuevamente.");
    return null;
  }
}

// Function to check the user's role and update the navbar
function updateNavbarBasedOnRole() {
  const userRole = localStorage.getItem("userRole"); // Get the user's role from localStorage
  const vendedoresLink = document.getElementById("vendedores-link");
  const logoutButton = document.getElementById("logout-button");
  const loginButton = document.getElementById("login-button");
  const mobileLogoutButton = document.getElementById("mobile-logout-button");
  const mobileLoginButton = document.getElementById("mobile-login-button");

  if (userRole) {
    // User is logged in, show the logout button (desktop and mobile)
    if (logoutButton) {
      loginButton.style.display = "none";
      logoutButton.style.display = "block";
    }
    if (mobileLogoutButton && mobileLoginButton) {
      mobileLoginButton.style.display = "none";
      mobileLogoutButton.style.display = "block";
    }

    // Show or hide the vendedores link based on the role
    if (vendedoresLink) {
      if (userRole === "admin" || userRole === "vendedor") {
        vendedoresLink.style.display = "block";
      } else {
        vendedoresLink.style.display = "none";
      }
    }
  } else {
    // User is not logged in, hide the logout button (desktop and mobile)
    if (logoutButton) {
      loginButton.style.display = "block";
      logoutButton.style.display = "none";
    }
    if (mobileLogoutButton && mobileLoginButton) {
      mobileLoginButton.style.display = "block";
      mobileLogoutButton.style.display = "none";
    }

    // Hide the vendedores link
    if (vendedoresLink) {
      vendedoresLink.style.display = "none";
    }
  }
}

// Logout function
function logout() {
  // Clear localStorage
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("userRole");

  // Update the UI to reflect the logged-out state
  updateNavbarBasedOnRole();

  // Redirect to the login page
  window.location.href = "loginNexus.html";
}

// Add event listeners
document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logout-button");
  const mobileLogoutButton = document.getElementById("mobile-logout-button");

  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }
  if (mobileLogoutButton) {
    mobileLogoutButton.addEventListener("click", logout);
  }

  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", loginUsuario);
  }
});

// Call the function when the page loads
window.onload = function () {
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");

  if (userId && userName && userRole) {
    // User is logged in, update the UI
    updateNavbarBasedOnRole();
  } else {
    // User is not logged in, ensure the logout button is hidden
    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
      logoutButton.style.display = "none";
    }
  }
};
