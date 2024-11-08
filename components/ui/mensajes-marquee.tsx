import Marquee from 'react-fast-marquee';

interface Mensaje {
  id: string;
  nombre: string;
  mensaje: string;
}

interface MensajesMarqueeProps {
  mensajes: Mensaje[];
  onMensajeClick: (mensaje: Mensaje) => void;
  isLoading: boolean;
}

function getGradientByIndex(index: number) {
  const colors = [
    'from-pink-500 to-violet-500',
    'from-cyan-500 to-blue-500',
    'from-green-500 to-emerald-500',
    'from-yellow-500 to-orange-500',
    'from-purple-500 to-indigo-500'
  ];
  return colors[index % colors.length];
}

export function MensajesMarquee({ mensajes, onMensajeClick }: MensajesMarqueeProps) {
  const tarjetas = mensajes.length > 0 ? mensajes : [{
    id: 'placeholder-1',
    nombre: "Invitado",
    mensaje: "Deja tu mensaje especial aquí"
  }];

  const tarjetasDuplicadas = [...tarjetas, ...tarjetas];

  return (
    <Marquee
      gradient={false}
      speed={40}
      pauseOnHover={true}
    >
      {tarjetasDuplicadas.map((mensaje, index) => {
        const gradientClass = getGradientByIndex(index % tarjetas.length);
        const initial = mensaje.nombre.charAt(0).toUpperCase();

        return (
          <div
            key={`${mensaje.id}-${index}`}
            onClick={() => onMensajeClick(mensaje)}
            className="w-[300px] h-[140px] bg-white/10 p-6 rounded-lg cursor-pointer hover:bg-white/20 transition-colors mx-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${gradientClass} flex items-center justify-center text-white font-semibold`}>
                {initial}
              </div>
              <p className="font-semibold text-white">{mensaje.nombre}</p>
            </div>
            <p className="text-gray-300 text-sm line-clamp-2 leading-5">{mensaje.mensaje}</p>
          </div>
        );
      })}
    </Marquee>
  );
} 