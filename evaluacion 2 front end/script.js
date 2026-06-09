const form = document.getElementById("formulario");

const campos = [
  {
    id: "nombre",
    errorId: "errorNombre",
    requerido: true,
    mensajeRequerido: "El nombre completo es requerido.",
    validador: valor => valor.trim() !== "",
    mensajeInvalido: "El nombre completo es requerido."
  },
  {
    id: "rut",
    errorId: "errorRut",
    requerido: true,
    mensajeRequerido: "El RUT es requerido.",
    validador: valor => validarRut(valor),
    mensajeInvalido: "El RUT ingresado no es válido."
  },
  {
    id: "fechaNacimiento",
    errorId: "errorFecha",
    requerido: false,
    validador: valor => valor.trim() === "" || validarFecha(valor),
    mensajeInvalido: "La fecha debe tener formato dd/MM/yyyy."
  },
  {
    id: "cv",
    errorId: "errorCv",
    requerido: false,
    validador: archivo => validarArchivoCV(archivo),
    mensajeInvalido: "Solo se permiten archivos PDF o DOCX."
  },
  {
    id: "email",
    errorId: "errorEmail",
    requerido: true,
    mensajeRequerido: "El email es requerido.",
    validador: valor => validarEmail(valor),
    mensajeInvalido: "Debe ingresar un email válido."
  },
  {
    id: "password",
    errorId: "errorPassword",
    requerido: true,
    mensajeRequerido: "La contraseña es requerida.",
    validador: valor => validarPassword(valor),
    mensajeInvalido: "Debe tener 8 a 12 caracteres, mayúscula, minúscula, número y especial."
  },
  {
    id: "repetirPassword",
    errorId: "errorRepetirPassword",
    requerido: true,
    mensajeRequerido: "Debe repetir la contraseña.",
    validador: valor => validarCoincidenciaPassword(valor),
    mensajeInvalido: "Las contraseñas no coinciden."
  }
];

function limpiarErrores() {
  document.querySelectorAll(".error-message").forEach(el => el.textContent = "");
  document.querySelectorAll("input, select").forEach(el => el.classList.remove("error"));
}

function mostrarError(campo, mensaje, errorElementId) {
  campo.classList.add("error");
  document.getElementById(errorElementId).textContent = mensaje;
}

function limpiarFormulario() {
  form.reset();
  limpiarErrores();
}

function validarRut(rut) {
  rut = rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
  if (!/^\d{7,8}[0-9K]$/.test(rut)) return false;

  const cuerpo = rut.slice(0, -1);
  const dv = rut.slice(-1);

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  const resto = 11 - (suma % 11);
  let dvEsperado = "";

  if (resto === 11) dvEsperado = "0";
  else if (resto === 10) dvEsperado = "K";
  else dvEsperado = resto.toString();

  return dv === dvEsperado;
}

function validarFecha(fecha) {
  const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  if (!regex.test(fecha)) return false;

  const [dia, mes, anio] = fecha.split("/").map(Number);
  const fechaObj = new Date(anio, mes - 1, dia);

  return (
    fechaObj.getFullYear() === anio &&
    fechaObj.getMonth() === mes - 1 &&
    fechaObj.getDate() === dia
  );
}

function validarArchivoCV(inputFile) {
  if (inputFile.files.length === 0) return true;
  const nombre = inputFile.files[0].name.toLowerCase();
  return nombre.endsWith(".pdf") || nombre.endsWith(".docx");
}

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validarPassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,12}$/;
  return regex.test(password);
}

function validarCoincidenciaPassword(valorRepetido) {
  const password = document.getElementById("password").value;
  return valorRepetido === password;
}

function validarFormulario() {
  limpiarErrores();
  let valido = true;

  campos.forEach(campoInfo => {
    const campo = document.getElementById(campoInfo.id);
    const valor = campo.type === "file" ? campo : campo.value.trim();

    if (campoInfo.requerido) {
      if (
        (campo.type === "file" && campo.files.length === 0) ||
        (campo.type !== "file" && campo.value.trim() === "")
      ) {
        mostrarError(campo, campoInfo.mensajeRequerido, campoInfo.errorId);
        valido = false;
        return;
      }
    }

    if (!campoInfo.validador(valor)) {
      mostrarError(campo, campoInfo.mensajeInvalido, campoInfo.errorId);
      valido = false;
    }
  });

  return valido;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (validarFormulario()) {
    alert("Envío de datos exitoso.");
    limpiarFormulario();
  }
});