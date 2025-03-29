const SUPABASE_URL = "https://bfihgfaijaxktljjtvfo.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmaWhnZmFpamF4a3Rsamp0dmZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzOTU3NjYsImV4cCI6MjA1NDk3MTc2Nn0.Nu2WoGRaJuLi-ovBrVkUpZCJ3tCHzc76TmcBDBHsUfk";

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

// Función para manejar el registro
async function registrarUsuario(event) {
  event.preventDefault(); // Evita que el formulario se recargue

  // Obtener los valores del formulario
  const name = document.getElementById("name").value;
  const apellido = document.getElementById("secondName").value;
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!name || !apellido || !email || !username || !password) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  try {
    // Verificar si el correo ya existe en la base de datos
    const emailCheckResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/usuarios?correo=eq.${email}`,
      {
        method: "GET",
        headers: headers,
      }
    );

    const existingUsers = await emailCheckResponse.json();

    if (existingUsers.length > 0) {
      // Si el correo ya existe, mostrar un mensaje de error
      alert("El correo electrónico ya está registrado. Por favor, usa otro.");
      return;
    }

    // Datos a enviar a Supabase
    const datos = {
      nombre: name, // Asegúrate de que coincida con el nombre de la columna en la tabla
      apellido,
      correo: email,
      contrasena: password,
      id_rol: 2, // Asigna un valor válido para el rol
    };

    // Realizar la inserción en Supabase
    const response = await fetch(`${SUPABASE_URL}/rest/v1/usuarios`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(datos),
    });

    if (response.ok) {
      alert("¡Registro exitoso!");
      // Redirigir al usuario a la página de login
      window.location.href = "index.html";
    } else {
      console.error("Error en el registro:", response.statusText);
      alert("Hubo un error al registrar el usuario.");
    }
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    alert("Hubo un error al registrar el usuario. Intenta nuevamente.");
  }
}

// Asociar el evento al formulario
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registroForm");
  form.addEventListener("submit", registrarUsuario);
});
