const SUPABASE_URL = "https://bfihgfaijaxktljjtvfo.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmaWhnZmFpamF4a3Rsamp0dmZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzOTU3NjYsImV4cCI6MjA1NDk3MTc2Nn0.Nu2WoGRaJuLi-ovBrVkUpZCJ3tCHzc76TmcBDBHsUfk";

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};


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

// Function to generate a timestamp-based order code
// Function to generate a 6-digit order code
function generateOrderCode() {
  return Math.floor(100000 + Math.random() * 900000); // Generates a number between 100000 and 999999
}

// Function to generate a unique 6-digit order code
async function generateUniqueOrderCode() {
  let isUnique = false;
  let orderCode;

  while (!isUnique) {
    orderCode = generateOrderCode(); // Generate a 6-digit code
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/orders?order_code=eq.${orderCode}`,
      {
        method: "GET",
        headers: headers,
      }
    );

    if (!response.ok) {
      throw new Error("Error al verificar el código único.");
    }

    const data = await response.json();
    if (data.length === 0) {
      isUnique = true; // Code is unique
    }
  }

  return orderCode;
}

// Array to store cart items
let cartItems = [];

// Object to store product quantities
let productQuantities = {};

// Sample product data (replace with your actual data or fetch from Supabase)
const products = [
  {
    category: "Sandwich",
    items: [
      {
        name: "Club Sandwich",
        price: 70,
        image:
          "Snack img/Classic-Club-Sandwich-FT-RECIPE0523-99327c9c87214026b9419b949ee13a9c (1).jpg",
      },
      {
        name: "Sandwich de Pollo",
        price: 120,
        image: "Snack img/sandwich de pollo.jpg",
      },
      { name: "hamburguesa", price: 100, image: "Snack img/images (1).jpg" },
    ],
  },
  {
    category: "Chips",
    items: [
      { name: "Papas Clásicas", price: 35, image: "Snack img/images.jpg" },
      { name: "Doritos", price: 35, image: "Snack img/doritos.png" },
      { name: "Cheetos", price: 15, image: "Snack img/cheetoss.jpg" },
    ],
  },
  {
    category: "Bebidas",
    items: [
      { name: "malta morena", price: 40, image: "Snack img/malta_morena.jpg" },
      { name: "jugo rica", price: 35, image: "Snack img/jugo_rica.jpg" },
      {
        name: "jugos naturales",
        price: 45,
        image: "Snack img/jugos_naturales.jpg",
      },
    ],
  },
  {
    category: "Galletas",
    items: [
      { name: "oreo", price: 30, image: "Snack img/oreo.jpg" },
      { name: "dino", price: 20, image: "Snack img/dino.jpg" },
    ],
  },
];

// List of natural juices
const naturalJuices = [
  "limon",
  "avena con chinola",
  "zanahoria",
  "cereza",
  "tamarindo",
];

// Function to dynamically render products
function renderProducts() {
  const productsContainer = document.getElementById("products-container");
  productsContainer.innerHTML = "";

  products.forEach((category) => {
    const categorySection = document.createElement("div");
    categorySection.className = "category-section";
    categorySection.innerHTML = `
      <h3 class="text-xl font-bold mb-4 text-red-800">${category.category}</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        ${category.items
          .map((item) => {
            // Check if this is the natural juices item
            if (item.name === "jugos naturales") {
              return `
                <div class="product-card bg-white p-4 rounded-lg shadow">
                  <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover rounded-lg mb-4">
                  <h4 class="font-semibold">${item.name}</h4>
                  <p class="text-gray-600 mb-8">$${item.price}</p>
                  <button onclick="openJuiceModal()" class="mt-2 w-full bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800">Seleccionar Jugos</button>
                </div>
              `;
            } else {
              // Initialize quantity for regular products if not already set
              if (!productQuantities[item.name]) {
                productQuantities[item.name] = 1;
              }

              return `
                <div class="product-card bg-white p-4 rounded-lg shadow">
                  <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover rounded-lg mb-4">
                  <h4 class="font-semibold">${item.name}</h4>
                  <p class="text-gray-600">$${item.price}</p>
                  <div class="flex items-center justify-between mt-2">
                    <button onclick="updateQuantity('${item.name}', -1)" class="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800">-</button>
                    <span id="quantity-${item.name}" class="text-lg">1</span>
                    <button onclick="updateQuantity('${item.name}', 1)" class="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800">+</button>
                  </div>
                  <button onclick="addToCart('${item.name}', ${item.price})" class="mt-2 w-full bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800">Agregar</button>
                </div>
              `;
            }
          })
          .join("")}
      </div>
    `;
    productsContainer.appendChild(categorySection);
  });
}

// Function to open the juice modal
function openJuiceModal() {
  const juiceModal = document.getElementById("juice-modal");
  if (!juiceModal) {
    // Create the modal if it doesn't exist
    createJuiceModal();
  } else {
    // Reset the juice quantities
    resetJuiceQuantities();
    juiceModal.classList.remove("hidden");
  }
}

// Function to create the juice selection modal
function createJuiceModal() {
  const modalHTML = `
    <div id="juice-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">Seleccionar Jugos Naturales</h3>
          <button onclick="closeJuiceModal()" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p class="text-gray-600 mb-4">Todos los jugos tienen un precio de $45</p>
        <div id="juice-list" class="space-y-3 max-h-60 overflow-y-auto">
          ${naturalJuices
            .map(
              (juice) => `
            <div class="flex items-center justify-between p-2 border-b">
              <span class="text-gray-700 capitalize">${juice}</span>
              <div class="flex items-center">
                <button onclick="updateJuiceQuantity('${juice}', -1)" class="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800">-</button>
                <span id="quantity-${juice}" class="text-lg mx-2">0</span>
                <button onclick="updateJuiceQuantity('${juice}', 1)" class="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800">+</button>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
        <div class="mt-6 flex justify-end">
          <button onclick="closeJuiceModal()" class="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400">
            Cancelar
          </button>
          <button onclick="addSelectedJuicesToCart()" class="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800">
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

// Function to reset juice quantities
function resetJuiceQuantities() {
  naturalJuices.forEach((juice) => {
    const quantityElement = document.getElementById(`quantity-${juice}`);
    if (quantityElement) {
      quantityElement.textContent = "0";
    }
    // Reset the tracking for this juice
    delete productQuantities[juice];
  });
}

// Function to close the juice modal
function closeJuiceModal() {
  const juiceModal = document.getElementById("juice-modal");
  if (juiceModal) {
    juiceModal.classList.add("hidden");
  }
}

// Function to update the quantity of a selected juice
function updateJuiceQuantity(juice, change) {
  const quantityElement = document.getElementById(`quantity-${juice}`);
  let quantity = parseInt(quantityElement.textContent);
  quantity += change;
  if (quantity < 0) quantity = 0; // Allow quantity to be 0 for deselection
  quantityElement.textContent = quantity;

  // Mark this juice as having been modified by the user
  productQuantities[juice] = quantity;
}

// Function to add selected juices to the cart
function addSelectedJuicesToCart() {
  let selectedJuicesCount = 0;

  naturalJuices.forEach((juice) => {
    const quantity = productQuantities[juice] || 0;

    // Only add juices with quantity greater than 0
    if (quantity > 0) {
      // Add each individual juice to the cart
      addToCart(juice, 45); // Price is 45 for all juices
      selectedJuicesCount++;
    }
  });

  // If no juices were selected, inform the user
  if (selectedJuicesCount === 0) {
    alert("Por favor selecciona al menos un jugo.");
    return;
  }

  // Close the modal after adding to cart
  closeJuiceModal();
}

// Function to update the quantity of a product
function updateQuantity(productName, change) {
  if (!productQuantities[productName]) {
    productQuantities[productName] = 1;
  }
  productQuantities[productName] += change;
  if (productQuantities[productName] < 1) {
    productQuantities[productName] = 1;
  }
  document.getElementById(`quantity-${productName}`).textContent =
    productQuantities[productName];
}

// Function to add a product to the cart
function addToCart(productName, price) {
  const quantity = productQuantities[productName] || 1;
  const totalPrice = price * quantity;

  // Check if the product already exists in the cart
  const existingItemIndex = cartItems.findIndex(
    (item) => item.productName === productName
  );

  if (existingItemIndex !== -1) {
    // If the product exists, update its quantity and total price
    cartItems[existingItemIndex].quantity += quantity;
    cartItems[existingItemIndex].totalPrice += totalPrice;
  } else {
    // If the product doesn't exist, add it to the cart
    cartItems.push({ productName, price, quantity, totalPrice });
  }

  // Reset the quantity for this product
  productQuantities[productName] = 1;
  if (document.getElementById(`quantity-${productName}`)) {
    document.getElementById(`quantity-${productName}`).textContent = 1;
  }

  // Update the cart UI
  updateCartUI();
}
// Function to remove a product from the cart
function removeFromCart(index) {
  cartItems.splice(index, 1); // Remove the item from the array
  updateCartUI(); // Update the UI
}

// Function to update the cart UI
function updateCartUI() {
  const cartList = document.getElementById("cart-list");
  const totalPriceElement = document.getElementById("total-price");

  // Clear the cart list
  cartList.innerHTML = "";

  // Calculate the total price
  let total = 0;

  // Add each item to the cart list
  cartItems.forEach((item, index) => {
    const cartItem = document.createElement("div");
    cartItem.className = "flex justify-between items-center mb-2";
    cartItem.innerHTML = `
                        <span>${item.productName} - $${item.price} x ${item.quantity}</span>
                        <button onclick="removeFromCart(${index})" class="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">
                            Eliminar
                        </button>
                    `;
    cartList.appendChild(cartItem);

    // Add to the total price
    total += item.totalPrice;
  });

  // Update the total price
  totalPriceElement.textContent = total.toFixed(2);
}

// Function to send the cart data to Supabase
// Function to send the cart data to Supabase
async function finalizarPedido() {
  const userId = localStorage.getItem("userId"); // Get the user ID from localStorage

  if (cartItems.length === 0) {
    alert(
      "El carrito está vacío. Agrega productos antes de finalizar el pedido."
    );
    return;
  }

  if (!userId) {
    alert("No se ha iniciado sesión. Por favor, inicia sesión primero.");
    return;
  }

  try {
    // Generate a unique order code
    const orderCode = await generateUniqueOrderCode();

    // Send each item in the cart to Supabase
    for (const item of cartItems) {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          id_usuario: userId,
          product_name: item.productName,
          quantity: item.quantity,
          total_price: item.totalPrice,
          order_date: new Date().toISOString(),
          order_code: orderCode, // Include the order code
        }),
      });

      if (!response.ok) {
        throw new Error("Error al agregar el pedido.");
      }
    }

    // Clear the cart after successful submission
    cartItems = [];
    updateCartUI();

    // Show the order code in a modal
    showOrderCodeModal(orderCode);
  } catch (error) {
    console.error("Error al finalizar el pedido:", error);
    alert("Hubo un error al finalizar el pedido. Intenta nuevamente.");
  }
}

// Function to show the order code in a modal
function showOrderCodeModal(orderCode) {
  // Create the modal HTML
  const modalHTML = `
            <div id="order-code-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white p-6 rounded-lg shadow-lg text-center">
                    <h3 class="text-xl font-bold mb-4">¡Pedido Finalizado!</h3>
                    <p class="text-gray-600">Muestra este código al cajero:</p>
                    <p class="text-2xl font-bold text-red-800 my-4">${orderCode}</p>
                    <button onclick="closeOrderCodeModal()" class="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800">
                        Cerrar
                    </button>
                </div>
            </div>
        `;

  // Add the modal to the body
  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

// Function to close the modal
function closeOrderCodeModal() {
  const modal = document.getElementById("order-code-modal");
  if (modal) {
    modal.remove();
  }
}
// Add event listener to the "Finalizar Pedido" button
document
  .getElementById("finalizar-pedido")
  .addEventListener("click", finalizarPedido);

// Render products when the page loads
document.addEventListener("DOMContentLoaded", () => {
  // Render products
  renderProducts();

  // Check user login status and update the navbar
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
});
