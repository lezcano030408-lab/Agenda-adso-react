import { useEffect, useState } from "react";
import {
  listarContactos,
  crearContacto,
  eliminarContactoPorId,
} from "./api.js";
import FormularioContacto from "./components/FormularioContacto";
import ContactoCard from "./components/ContactoCard";

export default function App() {
  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // ===============================
  // Cargar contactos al iniciar
  // ===============================
  useEffect(() => {
    const cargarContactos = async () => {
      try {
        setCargando(true);
        setError("");

        const data = await listarContactos();
        setContactos(data);
      } catch (error) {
        console.error(
          "Ocurrió un error al momento de cargar los contactos:",
          error
        );

        setError(
          "No se pudieron cargar los contactos. Verifica que el servidor esté encendido e intenta de nuevo."
        );
      } finally {
        setCargando(false);
      }
    };

    cargarContactos();
  }, []);

  // ===============================
  // Agregar contacto
  // ===============================
  const onAgregarContacto = async (nuevoContacto) => {
  try {
    setError("");
    const creado = await crearContacto(nuevoContacto);

    // EVITAR DUPLICADO:
    setContactos((prev) => {
      // Si el ID que devuelve la API ya está en mi lista, no lo agrego
      const yaExiste = prev.some((c) => c.id === creado.id);
      if (yaExiste) return prev; 
      
      // Si no existe, lo agrego normalmente
      return [...prev, creado];
    });

  } catch (error) {
    console.error("Error al crear contacto:", error);
    setError("No se pudo guardar el contacto.");
    throw error;
  }
};

  // ===============================
  // Eliminar contacto
  // ===============================
  const onEliminarContacto = async (id) => {
    try {
      setError("");
      await eliminarContactoPorId(id);

      setContactos((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error al eliminar contacto:", error);

      setError(
        "No se pudo eliminar el contacto. Vuelve a intentarlo o verifica el servidor."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <p className="text-xs tracking-[0.3em] text-gray-500 uppercase">
            Desarrollo Web ReactJS Ficha 3229207
          </p>

          <h1 className="text-4xl font-extrabold text-gray-900 mt-2">
            Agenda ADSO v6
          </h1>

          <p className="text-sm text-gray-600 mt-1">
            Gestión de contactos conectada a una API local con JSON Server,
            ahora con validaciones y mejor experiencia de usuario.
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
            <FormularioContacto onAgregar={onAgregarContacto} />

            <section className="space-y-4">
              {contactos.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No tienes contactos añadidos en este momento, ¡Anímate a añadir uno!
                </p>
              ) : (
                contactos.map((c) => (
                  <ContactoCard
                    key={c.id}
                    nombre={c.nombre}
                    telefono={c.telefono}
                    correo={c.correo}
                    etiqueta={c.etiqueta}
                    onEliminar={() => onEliminarContacto(c.id)}
                  />
                ))
              )}
            </section>
          </>
        )}

        <footer className="mt-8 text-xs text-gray-400">
          <p>Desarrollo Web – ReactJS | Proyecto Agenda ADSO</p>
          <p>Instructor: Gustavo Adolfo Bolaños Dorado</p>
          <p>
            Aprendices: Oscar Alvarez Lopez, Miguel Lezcano,
            Carolina David Montoya, Angie Paola Valencia Suarez,
            Brayan Soto Rivero.
          </p>
        </footer>
      </div>
    </div>
  );
}