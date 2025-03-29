const SUPABASE_URL = "https://bfihgfaijaxktljjtvfo.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmaWhnZmFpamF4a3Rsamp0dmZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzOTU3NjYsImV4cCI6MjA1NDk3MTc2Nn0.Nu2WoGRaJuLi-ovBrVkUpZCJ3tCHzc76TmcBDBHsUfk";

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};
// src/js/vendedores.js

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

// Función para mostrar los pedidos en la tabla
// Función para mostrar los pedidos en la tabla
// Función para obtener los pedidos con el nombre del usuario
async function fetchOrdersWithUserName() {
  const userId = localStorage.getItem("userId"); // Obtener el ID del usuario desde localStorage

  if (!userId) {
    alert("No se ha iniciado sesión. Por favor, inicia sesión primero.");
    window.location.href = "loginNexus.html"; // Redirigir al login si no hay usuario
    return;
  }

  try {
    // Realizar una consulta JOIN entre las tablas 'orders' y 'usuarios'
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/orders?select=*,usuarios(nombre)&order=order_date.desc`,
      {
        method: "GET",
        headers: headers,
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener los pedidos");
    }

    const data = await response.json();
    console.log("Pedidos del usuario con nombre:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
    alert("Hubo un error al obtener los pedidos. Intenta nuevamente.");
    return [];
  }
}

// Función para mostrar los pedidos en la tabla
async function displayOrders() {
  const orders = await fetchOrdersWithUserName();
  const orderList = document.getElementById("order-list");

  if (orders && orders.length > 0) {
    orderList.innerHTML = orders
      .map(
        (order) => `
        <tr>
          <td>${order.usuarios.nombre}</td> <!-- User's name -->
          <td>${order.product_name}</td> <!-- Product name -->
          <td>${order.quantity}</td> <!-- Quantity -->
          <td>$${order.total_price}</td> <!-- Total price -->
          <td>${new Date(
            order.order_date
          ).toLocaleString()}</td> <!-- Order date -->
          <td>${order.order_code}</td> <!-- Order code -->
        </tr>
      `
      )
      .join("");
  } else {
    orderList.innerHTML =
      '<tr><td colspan="6">No se encontraron pedidos.</td></tr>';
  }
}

// Add event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Update the navbar based on the user's role
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");

  if (userId && userName && userRole) {
    // User is logged in, update the UI
    updateNavbarBasedOnRole();
  } else {
    // User is not logged in, ensure the logout button is hidden
    const logoutButton = document.getElementById("logout-button");
    const mobileLogoutButton = document.getElementById("mobile-logout-button");
    if (logoutButton) {
      logoutButton.style.display = "none";
    }
    if (mobileLogoutButton) {
      mobileLogoutButton.style.display = "none";
    }
  }

  // Add event listeners for logout buttons
  const logoutButton = document.getElementById("logout-button");
  const mobileLogoutButton = document.getElementById("mobile-logout-button");

  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }
  if (mobileLogoutButton) {
    mobileLogoutButton.addEventListener("click", logout);
  }

  // Display orders when the page loads
  displayOrders();
});
