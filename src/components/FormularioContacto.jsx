import { useState, useEffect } from "react";

export default function FormularioContacto({
  onAgregar,
  onActualizar,
  contactoEditar,
  onCancelarEdicion,
}) {
  // Estado del formulario como objeto único controlado
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    etiqueta: "",
  });

  const [errores, setErrores] = useState({
    nombre: "",
    telefono: "",
    correo: "",
  });

  const [enviando, setEnviando] = useState(false);

  // Cada vez que contactoEditar cambie, llenamos el formulario
  useEffect(() => {
    if (contactoEditar) {
      setForm({
        nombre: contactoEditar.nombre,
        telefono: contactoEditar.telefono,
        correo: contactoEditar.correo,
        etiqueta: contactoEditar.etiqueta || "",
      });
    } else {
      setForm({ nombre: "", telefono: "", correo: "", etiqueta: "" });
      setErrores({ nombre: "", telefono: "", correo: "" });
    }
  }, [contactoEditar]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  function validarFormulario() {
    const nuevosErrores = { nombre: "", telefono: "", correo: "" };

    if (!form.nombre.trim()) {
      nuevosErrores.nombre = "Rellena este campo con tu nombre.";
    }

    if (!form.telefono.trim()) {
      nuevosErrores.telefono = "Rellena este campo con tu número de teléfono.";
    }

    if (!form.correo.trim()) {
      nuevosErrores.correo = "Este campo es obligatorio";
    } else if (!form.correo.includes("@")) {
      nuevosErrores.correo = "Recuerda que el uso del @ es obligatorio en este campo.";
    }

    setErrores(nuevosErrores);

    return !nuevosErrores.nombre && !nuevosErrores.telefono && !nuevosErrores.correo;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    const esValido = validarFormulario();
    if (!esValido) {
      setEnviando(false);
      return;
    }

    try {
      // Simulación de retardo
      await new Promise((res) => setTimeout(res, 1000));

      if (contactoEditar) {
        await onActualizar({ ...contactoEditar, ...form });
      } else {
        await onAgregar(form);
      }

      // Limpiamos el formulario
      setForm({ nombre: "", telefono: "", correo: "", etiqueta: "" });
      setErrores({ nombre: "", telefono: "", correo: "" });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form
      className="bg-white shadow-sm rounded-2xl p-6 space-y-4 mb-8"
      onSubmit={onSubmit}
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        {contactoEditar ? "Editar contacto" : "Nuevo contacto"}
      </h2>

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del contacto *
        </label>
        <input
                className="w-full md:flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          name="nombre"
          placeholder="Ej: Camila Pérez"
          value={form.nombre}
          onChange={onChange}
        />
        {errores.nombre && (
          <p className="mt-1 text-xs text-red-600">{errores.nombre}</p>
        )}
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Teléfono del contacto *
        </label>
        <input
                className="w-full md:flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          name="telefono"
          placeholder="Ej: 300 123 4567"
          value={form.telefono}
          onChange={onChange}
        />
        {errores.telefono && (
          <p className="mt-1 text-xs text-red-600">{errores.telefono}</p>
        )}
      </div>

      {/* Correo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Correo del contacto *
        </label>

        <input
          className="w-full md:flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          name="correo"
          placeholder="Ej: camila@sena.edu.co"
          value={form.correo}
          onChange={onChange}
        />
        {errores.correo && (
          <p className="mt-1 text-xs text-red-600">{errores.correo}</p>
        )}
      </div>

      {/* Etiqueta */}
      <div>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Añade una etiqueta contacto (opcional)
        </label>

        <input
          className="w-full md:flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          name="etiqueta"
          placeholder="Ej: Trabajo"
          value={form.etiqueta}
          onChange={onChange}
        />
      </div>

      {/* Botones */}
      <div className="pt-2 flex gap-2">
        <button
          type="submit"
          disabled={enviando}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-800 disabled:bg-purple-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold shadow-sm"
        >
          {enviando ? "Guardando..." : contactoEditar ? "Actualizar" : "Agregar contacto"}
        </button>

        {contactoEditar && (
          <button
            type="button"
            onClick={onCancelarEdicion}
            className="w-full md:w-auto bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-xl font-semibold shadow-sm"
          >Cancelar</button>
        )}
      </div>
    </form>
  );
}