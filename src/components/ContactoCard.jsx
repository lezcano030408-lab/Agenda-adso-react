export default function ContactoCard({ nombre, telefono, correo, etiqueta, onEliminar, onEditar }) {
  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 flex items-start justify-between">
      {/* Información del contacto */}
      <div className="space-y-1">
        {/* Nombre */}
        <h3 className="text-xl font-semibold text-gray-800">{nombre}</h3>

        {/* Teléfono */}
        <p className="text-gray-600 text-sm flex items-center gap-2">
          <span className="text-blue-600 text-lg">📞</span>
          {telefono}
        </p>

        {/* Correo */}
        <p className="text-gray-600 text-sm flex items-center gap-2">
          <span className="text-blue-600 text-lg">✉️</span>
          {correo}
        </p>

        {/* Etiqueta (si existe) */}
        {etiqueta && (
          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full mt-2">
            {etiqueta}
          </span>
        )}
      </div>

      {/* Botones: Editar y Eliminar */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onEditar}
          className="bg-blue-600 hover:bg-blue-800 text-white text-sm px-4 py-2 rounded-lg shadow transition"
          type="button"
        >
          Editar
        </button>

        <button
          onClick={onEliminar}
          className="bg-blue-400 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg shadow transition"
          type="button"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}