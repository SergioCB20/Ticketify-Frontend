export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">¡Hola Tailwind!</h1>
        <p className="text-gray-600 mb-6">Si ves este diseño, Tailwind CSS está funcionando correctamente.</p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
          ¡Funciona! 🎉  Hola prueba Josmar
          Prueba PR :v
        </button>
      </div>
    </div>
  );
}
