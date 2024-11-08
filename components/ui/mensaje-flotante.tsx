interface MensajeProps {
  nombre: string;
  mensaje: string;
  onClick?: () => void;
  placeholder?: boolean;
}

export function MensajeFlotante({ nombre, mensaje, onClick, placeholder = false }: MensajeProps) {
  return (
    <div 
      onClick={onClick}
      className={`
        flex-shrink-0 w-80 bg-white/10 backdrop-blur-sm rounded-xl p-6 
        cursor-pointer transition-all duration-300 
        hover:bg-white/20 hover:transform hover:scale-105
        border border-white/20
      `}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-white/60 text-xl">
            {nombre.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-white text-lg">{nombre}</h3>
          <p className="text-white/60 text-sm">Mensaje para María</p>
        </div>
      </div>
      <p className="text-white/80 line-clamp-3">{mensaje}</p>
      <div className="mt-4 text-sm text-white/60 flex items-center justify-end">
        <span>Toca para leer más</span>
      </div>
    </div>
  );
}
