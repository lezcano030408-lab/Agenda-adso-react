// Componente principal de la aplicación Agenda ADSO
import { useEffect, useState } from "react";

// Importamos las funciones de la API (capa de datos)
import {
  listarContactos,
  crearContacto,
  eliminarContactoPorId,
  actualizarContactoPorId, // <-- nueva función en api.js
} from "./api";

// Importamos la configuración global de la aplicación
import { APP_INFO } from "./config";

// Importamos componentes hijos
import FormularioContacto from "./components/FormularioContacto";
import ContactoCard from "./components/ContactoCard";

function App() {
  // Estado que almacena la lista de contactos obtenidos de la API
  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // === NUEVOS ESTADOS ===
  const [busqueda, setBusqueda] = useState("");
  const [ordenAsc, setOrdenAsc] = useState(true);

  // Estado para editar contacto
  const [contactoEditar, setContactoEditar] = useState(null);

  // useEffect para cargar contactos iniciales
  useEffect(() => {
    const cargarContactos = async () => {
      try {
        setCargando(true);
        setError("");

        const data = await listarContactos();
        setContactos(data);
      } catch (error) {
        console.error("Error al cargar contactos:", error);
        setError(
          "No se pudieron cargar los contactos. Verifica que el servidor esté encendido e intenta de nuevo."
        );
      } finally {
        setCargando(false);
      }
    };
    cargarContactos();
  }, []);

  // === FUNCIONES CRUD ===

  // Agregar contacto
  const onAgregarContacto = async (nuevoContacto) => {
    try {
      setError("");
      const creado = await crearContacto(nuevoContacto);
      setContactos((prev) => [...prev, creado]);
    } catch (error) {
      console.error("Error al crear contacto:", error);
      setError(
        "No se pudo guardar el contacto. Verifica tu conexión o el estado del servidor e intenta nuevamente."
      );
      throw error;
    }
  };

  // Eliminar contacto
const onEliminarContacto = async (id) => {
  const confirmar = window.confirm("¿Estás seguro de que quieres borrar este contacto?");

  if (!confirmar) return; // si el usuario cancela, no hace nada

  try {
    setError("");
    await eliminarContactoPorId(id);
    setContactos((prev) => prev.filter((c) => c.id !== id));

    // Si estaba editando el contacto eliminado, cancelamos edición
    if (contactoEditar?.id === id) setContactoEditar(null);

  } catch (error) {
    console.error("Error al eliminar contacto:", error);
    setError(
      "No se pudo eliminar el contacto. Vuelve a intentarlo o verifica el servidor."
    );
  }
};

  // const onConfirmacionEliminar = onEliminarContacto => {
  //   try {
  //     setError("")
  //     await onConfirmacionEliminar
  //   }
  // }

  // Actualizar contacto
  const onActualizarContacto = async (contactoActualizado) => {
    try {
      setError("");
      await actualizarContactoPorId(contactoActualizado.id, contactoActualizado);
      setContactos((prev) =>
        prev.map((c) =>
          c.id === contactoActualizado.id ? contactoActualizado : c
        )
      );
      setContactoEditar(null); // Limpiamos el modo edición
    } catch (error) {
      console.error("Error al actualizar contacto:", error);
      setError("No se pudo actualizar el contacto. Intenta nuevamente.");
    }
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setContactoEditar(null);
  };

  // === FILTRADO Y ORDENAMIENTO ===
  const contactosFiltrados = contactos.filter((c) => {
    const termino = busqueda.toLowerCase();
    const nombre = c.nombre.toLowerCase();
    const correo = c.correo.toLowerCase();
    const etiqueta = (c.etiqueta || "").toLowerCase();

    return nombre.includes(termino) || correo.includes(termino) || etiqueta.includes(termino);
  });

  const contactosOrdenados = [...contactosFiltrados].sort((a, b) => {
    const nombreA = a.nombre.toLowerCase();
    const nombreB = b.nombre.toLowerCase();

    if (nombreA < nombreB) return ordenAsc ? -1 : 1;
    if (nombreA > nombreB) return ordenAsc ? 1 : -1;
    return 0;
  });

  // === JSX ===
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 via-purple-900 to-yellow-100">      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <p className="text-l tracking-[0.3em] text-red-100 uppercase">
            {APP_INFO.ficha}
          </p>

          <h1 className="text-4xl font-extrabold text-red-100 mt-2">
            {APP_INFO.titulo}
          </h1>

          <p className="text-sm text-red-100 mt-1">
            {APP_INFO.subtitulo}
          </p>
        </header>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        {cargando ? (
          <p className="text-sm text-gray-500">Cargando contactos...</p>
        ) : (
          <>
            {/* Formulario con soporte de edición */}
            <FormularioContacto
              onAgregar={onAgregarContacto}
              onActualizar={onActualizarContacto}
              contactoEditar={contactoEditar}
              onCancelarEdicion={cancelarEdicion}
            />

            {/* Buscador y orden */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <input
                type="text"
                className="w-full md:flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                placeholder="Buscar por nombre, correo o etiqueta..." 
                value={  busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setOrdenAsc((prev) => !prev)}
                className="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-200"
              >
                {ordenAsc ? "Ordenar Z-A" : "Ordenar A-Z"}
              </button>
            </div>

            {/* Listado de contactos */}
            <section className="space-y-4">
              {contactosOrdenados.length === 0 ? (
                <p className="text-sm text-red-100">
                  No se encontraron contactos que coincidan con la búsqueda.
                </p>
              ) : (
                contactosOrdenados.map((c) => (
                  <ContactoCard
                    key={c.id}
                    nombre={c.nombre}
                    telefono={c.telefono}
                    correo={c.correo}
                    etiqueta={c.etiqueta}
                    onEliminar={() => onEliminarContacto(c.id)}
                    onEditar={() => setContactoEditar(c)} // <-- botón editar
                  />
                ))
              )}
            </section>
          </>
        )}

        <footer className="mt-8 text-xs text-red-100">
          <p>Desarrollo Web – ReactJS | Proyecto Agenda ADSO</p>
          <p>Instructor: Gustavo Adolfo Bolaños Dorado</p>
          <p>Desarrolladores: Oscar Lopez, Bryan Soto, Miguel Lezcano, Carolina David</p>
        </footer>
      </div>
    </div>
  );
}

export default App;