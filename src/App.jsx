// Componente principal de la aplicación Agenda ADSO
import { useEffect, useState } from "react";

// Importamos las funciones de la API
import {
listarContactos,
crearContacto,
eliminarContactoPorId,
actualizarContactoPorId,
} from "./api";

// Importamos configuración
import { APP_INFO } from "./config";

// Componentes
import FormularioContacto from "./components/FormularioContacto";
import ContactoCard from "./components/ContactoCard";

function App() {
// === ESTADOS ===
const [contactos, setContactos] = useState([]);
const [cargando, setCargando] = useState(true);
const [error, setError] = useState("");

const [busqueda, setBusqueda] = useState("");
const [ordenAsc, setOrdenAsc] = useState(true);

const [contactoEditar, setContactoEditar] = useState(null);

const [vista, setVista] = useState("crear");

// === CARGAR CONTACTOS ===
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
        "No se pudieron cargar los contactos. Verifica que el servidor esté encendido."
      );

    } finally {
      setCargando(false);
    }
  };

  cargarContactos();
}, []);
// === CRUD ===

const onAgregarContacto = async (nuevoContacto) => {
try {
setError("");
const creado = await crearContacto(nuevoContacto);
setContactos((prev) => [...prev, creado]);
} catch (error) {
console.error("Error al crear contacto:", error);
setError("No se pudo guardar el contacto.");
throw error;
}
};

const onEliminarContacto = async (id) => {
const confirmar = window.confirm(
"¿Estás seguro de que quieres borrar este contacto?"
);


if (!confirmar) return;

try {
  setError("");
  await eliminarContactoPorId(id);
  setContactos((prev) => prev.filter((c) => c.id !== id));

  if (contactoEditar?.id === id) setContactoEditar(null);
} catch (error) {
  console.error("Error al eliminar contacto:", error);
  setError("No se pudo eliminar el contacto.");
}


};

const onActualizarContacto = async (contactoActualizado) => {
try {
setError("");


  await actualizarContactoPorId(
    contactoActualizado.id,
    contactoActualizado
  );

  setContactos((prev) =>
    prev.map((c) =>
      c.id === contactoActualizado.id ? contactoActualizado : c
    )
  );

  setContactoEditar(null);
} catch (error) {
  console.error("Error al actualizar contacto:", error);
  setError("No se pudo actualizar el contacto.");
}


};

const onEditarClick = (contacto) => {
setContactoEditar(contacto);
setError("");
};

const cancelarEdicion = () => {
setContactoEditar(null);
};

// === CAMBIO DE VISTAS ===

const irAVerContactos = () => {
setVista("contactos");
setContactoEditar(null);
};

const irACrearContacto = () => {
setVista("crear");
setContactoEditar(null);
setBusqueda("");
};

const estaEnVistaCrear = vista === "crear";
const estaEnVistaContactos = vista === "contactos";

// === FILTRADO ===
const contactosFiltrados = contactos.filter((c) => {
const termino = busqueda.toLowerCase();
const nombre = c.nombre.toLowerCase();
const correo = c.correo.toLowerCase();
const etiqueta = (c.etiqueta || "").toLowerCase();


return (
  nombre.includes(termino) ||
  correo.includes(termino) ||
  etiqueta.includes(termino)
);


});

// === ORDENAMIENTO ===
const contactosOrdenados = [...contactosFiltrados].sort((a, b) => {
const nombreA = a.nombre.toLowerCase();
const nombreB = b.nombre.toLowerCase();


if (nombreA < nombreB) return ordenAsc ? -1 : 1;
if (nombreA > nombreB) return ordenAsc ? 1 : -1;
return 0;


});

return ( 
<div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-slate-900">
  {/* HEADER SUPERIOR */}
<header className="border-b border-white/20 backdrop-blur bg-black/25">
  <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-gray-50">
        Proyecto ABP
      </p>
      <h1 className="text-lg font-semibold text-gray-50">
        Agenda ADSO – ReactJS
      </h1>
    </div>
 

      <p className="text-l text-gray-50">
        Ficha {APP_INFO.ficha}
      </p>
    </div>
  </header>

  {/* GRID PRINCIPAL */}
  <main className="max-w-6xl mx-auto px-4 py-8 grid gap-8 md:grid-cols-[1.6fr,1fr]">

    {/* COLUMNA IZQUIERDA */}
    <div>

      <header className="mb-8">
        <h2 className="text-4xl font-extrabold text-gray-100 mt-2">
          {APP_INFO.titulo}
        </h2>

        <p className="text-4xl text-gray-100 mt-1">
          {APP_INFO.subtitulo}
        </p>
      </header>

      {/* BOTÓN CAMBIO DE VISTA */}
      <div className="flex gap-3 mb-6">
        {estaEnVistaCrear ? (
          <button
            onClick={irAVerContactos}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Ver contactos
          </button>
        ) : (
          <button
            onClick={irACrearContacto}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg"
          >
            Crear contacto
          </button>
        )}
      </div>

      {/* ERRORES */}
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {/* CARGA */}
      {cargando ? (
        <p className="text-sm text-red-100">Cargando contactos...</p>
      ) : (
        <>
          {/* FORMULARIO CREAR */}
          {estaEnVistaCrear && (
            <FormularioContacto
              onAgregar={onAgregarContacto}
              onActualizar={onActualizarContacto}
              contactoEditar={null}
              onCancelarEdicion={cancelarEdicion}
            />
          )}

          {/* VISTA CONTACTOS */}
          {estaEnVistaContactos && (
            <>
              {contactoEditar && (
                <FormularioContacto
                  onAgregar={onAgregarContacto}
                  onActualizar={onActualizarContacto}
                  contactoEditar={contactoEditar}
                  onCancelarEdicion={cancelarEdicion}
                />
              )}

              {/* BUSCADOR */}
              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Buscar por nombre, correo o etiqueta..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setOrdenAsc((prev) => !prev)}
                  className="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-xl border border-gray-200"
                >
                  {ordenAsc ? "Ordenar Z-A" : "Ordenar A-Z"}
                </button>
              </div>

              {/* CONTADOR */}
              <p className="text-xs text-red-100 mb-3">
                Contactos encontrados: {contactosOrdenados.length}
              </p>

              {/* LISTA */}
              <section className="space-y-4">
                {contactosOrdenados.length === 0 ? (
                  <p className="text-sm text-red-100">
                    No se encontraron contactos.
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
                      onEditar={() => onEditarClick(c)}
                    />
                  ))
                )}
              </section>
            </>
          )}
        </>
      )}

      {/* FOOTER */}
      <footer className="mt-8 text-xs text-gray-100">
        <p>Desarrollo Web – ReactJS | Proyecto Agenda ADSO</p>
        <p>Instructor: Gustavo Adolfo Bolaños Dorado</p>
        <p>
          Desarrolladores: Oscar Lopez, Bryan Soto, Miguel Lezcano,
          Carolina David
        </p>
      </footer>
    </div>

    {/* COLUMNA DERECHA (TARJETAS) */}
    <aside className="space-y-4">

      {/* TARJETA DASHBOARD */}
      <div className="rounded-3xl bg-gradient-to-brbackdrop-blur bg-black/25 text-white p-8 shadow-xl">
        <p className="text-xs uppercase tracking-[0.3em] text-purple-100/80">
          Proyecto ABP
        </p>

        <h2 className="text-lg font-bold mt-2">
          Agenda ADSO – Dashboard
        </h2>

        <p className="text-sm text-purple-100 mt-2 ">
          CRUD completo con React, JSON Server, búsqueda,
          ordenamiento y edición.
        </p>

        <p className="mt-4 text-sm">
          Contactos registrados: {contactos.length}
        </p>
      </div>

      {/* TARJETA TIPS */}
      <div className="rounded-2xl backdrop-blur bg-black/25 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-100">
          Tips de código limpio
        </h3>

        <ul className="mt-2 text-xs text-gray-200 space-y-1">
          <li>• Componentes pequeños</li>
          <li>• Evita duplicar lógica</li>
          <li>• Usa nombres claros</li>
        </ul>
      </div>

      {/* TARJETA SENA */}
      <div className="rounded-2xl backdrop-blur bg-black/30 text-slate-100 p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-100">
          SENA CTMA
        </p>

        <p className="text-sm font-semibold mt-2">
          Desarrollo Web – ReactJS
        </p>

        <p className="text-xs text-slate-100 mt-2">
          Proyecto Agenda ADSO para portafolio.
        </p>
      </div>

    </aside>
  </main>
</div>


);
}

export default App;
