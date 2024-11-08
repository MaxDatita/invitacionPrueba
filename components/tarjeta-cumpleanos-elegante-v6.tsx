'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MapPin, Calendar, Check, FileImage, MessageSquare } from "lucide-react"
import Image from 'next/image'
import { Dancing_Script } from 'next/font/google'
import { MensajesMarquee } from './ui/mensajes-marquee'

// Inicializa la fuente
const dancingScript = Dancing_Script({ subsets: ['latin'] })

// Añade esta constante
const SPOTIFY_TRACK_URL = "https://open.spotify.com/embed/track/3DamFFqW32WihKkTVlwTYQ"

interface Mensaje {
  id: string;
  nombre: string;
  mensaje: string;
}

interface RSVPData {
  nombre: string;
  cantidadPersonas: number;
  notas: string;
}

export function TarjetaCumpleanosEleganteV6() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState({days: 0, hours: 0, minutes: 0, seconds: 0})
  const [showSharePreview] = useState(false)
  const [hasRSVPed, setHasRSVPed] = useState(false)
  const [isScheduleVisible, setIsScheduleVisible] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isImageTransitioning, setIsImageTransitioning] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [nombre, setNombre] = useState('')
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [isLoadingMensajes,] = useState(true)
  const [mensajeSeleccionado, setMensajeSeleccionado] = useState<{nombre: string, mensaje: string} | null>(null)
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [rsvpData, setRsvpData] = useState<RSVPData>({
    nombre: '',
    cantidadPersonas: 1,
    notas: ''
  });

  const images = [
    {
      src: "/img1.webp",
      alt: "María sonriendo en su jardín"
    },
    {
      src: "/img2.webp", 
      alt: "María celebrando con amigos"
    },
    {
      src: "/img3.webp",
      alt: "María en su graduación"
    }
  ]

  const eventDate = useMemo(() => new Date('2024-12-21T21:00:00'), []) // Fecha del evento
  const scheduleVisibleDate = useMemo(() => new Date('2024-12-29T00:00:00'), []) // Fecha de visibilidad del cronograma y contenido
  const rsvpDeadline = useMemo(() => new Date('2024-11-28T23:59:59'), []) // Fecha límite de confirmación de asistencia

  const [isRsvpEnabled, setIsRsvpEnabled] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const difference = eventDate.getTime() - now.getTime()

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / 1000 / 60) % 60)
      const seconds = Math.floor((difference / 1000) % 60)

      setTimeLeft({days, hours, minutes, seconds})
      setIsScheduleVisible(now >= scheduleVisibleDate)
      setIsRsvpEnabled(now <= rsvpDeadline)
    }, 1000)

    return () => clearInterval(timer)
  }, [eventDate, scheduleVisibleDate, rsvpDeadline])

  useEffect(() => {
    const displayDuration = 8000; // Tiempo que cada imagen se muestra
    const fadeInterval = setInterval(() => {
      setIsImageTransitioning(true);
      
      // Esperar a que termine el fade out antes de cambiar la imagen
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsImageTransitioning(false);
      }, 2000); // 1 segundo para el fade out
      
    }, displayDuration);

    return () => clearInterval(fadeInterval);
  }, [images.length]);

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const dotSize = 8 // Tamaño de cada punto
    const spacing = 10 // Espacio entre puntos
    const cols = Math.ceil(canvas.width / spacing)
    const rows = Math.ceil(canvas.height / spacing)

    const dots: {
      x: number
      y: number
      baseIntensity: number
      intensity: number
      targetIntensity: number
      speed: number
    }[] = []

    // Crear matriz de puntos
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        dots.push({
          x: i * spacing,
          y: j * spacing,
          baseIntensity: Math.random() * 0.5,
          intensity: 0,
          targetIntensity: Math.random(),
          speed: 0.02 + Math.random() * 0.03
        })
      }
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Crear efecto de resplandor central
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY)

      dots.forEach(dot => {
        // Calcular distancia desde el centro
        const dx = dot.x - centerX
        const dy = dot.y - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)
        const distanceFactor = 1 - (distance / maxDistance)

        // Actualizar intensidad
        if (Math.random() < 0.02) {
          dot.targetIntensity = Math.random() * 0.8 + 0.2
        }
        
        dot.intensity += (dot.targetIntensity - dot.intensity) * dot.speed
        
        // Calcular color final
        const intensity = (dot.intensity * 0.7 + dot.baseIntensity * 0.3) * distanceFactor
        const alpha = Math.max(0.1, intensity)

        // Dibujar punto con gradiente
        const gradient = ctx.createRadialGradient(
          dot.x, dot.y, 0,
          dot.x, dot.y, dotSize
        )

        gradient.addColorStop(0, `rgba(255, 20, 147, ${alpha})`) // Rosa fuerte
        gradient.addColorStop(0.3, `rgba(255, 0, 50, ${alpha * 0.8})`) // Rojo
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.beginPath()
        ctx.fillStyle = gradient
        ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2)
        ctx.fill()

        // Añadir brillo extra para puntos más intensos
        if (intensity > 0.6) {
          ctx.beginPath()
          ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.3})`
          ctx.arc(dot.x, dot.y, dotSize * 0.4, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    // Limpieza
    return () => {
      // Si necesitas limpiar algo
    }
  }, [])

  const handleRSVPSubmit = async () => {
    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rsvpData),
      });

      if (response.ok) {
        setHasRSVPed(true);
        setShowRSVPModal(false);
        // Aquí podrías mostrar un mensaje de éxito
      }
    } catch (error) {
      console.error('Error al enviar RSVP:', error);
      // Aquí podrías mostrar un mensaje de error
    }
  };

  const [mensajesDialogOpen, setMensajesDialogOpen] = useState(false);

  const handleEnviarMensaje = async () => {
    if (nombre && mensaje) {
      try {
        const response = await fetch('/api/mensajes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre,
            mensaje,
          }),
        });

        if (response.ok) {
          const nuevoMensaje = await response.json();
          setMensajes(prev => [...prev, nuevoMensaje]);
          setNombre('');
          setMensaje('');
          setMensajesDialogOpen(false); // Cerrar el modal
        }
      } catch (error) {
        console.error('Error al enviar mensaje:', error);
      }
    }
  };

  const fetchMensajes = async () => {
    try {
      const response = await fetch('/api/mensajes');
      if (response.ok) {
        const data = await response.json();
        setMensajes(data);
      }
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    }
  };

  useEffect(() => {
    // Carga inicial de mensajes
    fetchMensajes();

    // Configurar el intervalo de actualización (15 minutos = 900000 ms)
    const intervalId = setInterval(fetchMensajes, 900000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-black shadow-xl overflow-hidden relative">
        {/* Canvas al fondo */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 0 }}
        />
        
        {/* Contenido principal */}
        <div className="relative" style={{ zIndex: 1 }}>
          {/* Contenedor de video */}
          <div className="h-64 w-full bg-gradient-to-r from-pink-300 relative">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
            >
              <source src="/vid1.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
          </div>
          
          {/* Contenedor del título y reproductor de Spotify */}
          <div className="bg-black/50 py-4">
            <h1 className={`${dancingScript.className} text-5xl font-normal text-white drop-shadow-lg text-center mb-4`}>
              Celebremos Juntos
            </h1>
            {/* Solo mostrar el reproductor si el contador no ha llegado a cero */}
            {(timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0) && (
              <div className="px-4">
                <iframe 
                  src={SPOTIFY_TRACK_URL}
                  width="100%" 
                  height="80" 
                  frameBorder="0" 
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-lg"
                ></iframe>
              </div>
            )}
          </div>
          </div>
          

          {/* Resto del contenido */}
          <div className="relative px-3">
            <div className="relative my-6 mx-3">
              {/* Contenedor del carrusel con bordes redondeados */}
              <div className="relative w-full aspect-[4/4] rounded-[20px] overflow-hidden">
                <Image 
                  src={images[currentImageIndex].src} 
                  alt={images[currentImageIndex].alt}
                  fill
                  className={`
                    object-cover
                    transition-opacity duration-1000 ease-in-out
                    ${isImageTransitioning ? 'opacity-0' : 'opacity-100'}
                  `}
                  sizes="(max-width: 480px) 100vw,
                        (max-width: 768px) 75vw,
                        (max-width: 1024px) 50vw,
                        400px"
                  priority
                />
              </div>
            </div>
            {/* Texto de tarjeta condicional */}
            <p className="text-xl font-light text-gray-300 mb-2 text-center">
              {timeLeft.days < 0 && timeLeft.hours < 0 && timeLeft.minutes < 0 && timeLeft.seconds < 0 
                ? "Compartí una noche mágica junto a:"
                : "Te invitamos a celebrar el cumpleaños de"
              }
            </p>
            
            <p className="text-3xl font-semibold text-white mb-6 text-center">María</p>
            <p className="text-xl font-light text-gray-300 text-center">
              {timeLeft.days < 0 && timeLeft.hours < 0 && timeLeft.minutes < 0 && timeLeft.seconds < 0 
                ? "Mensajes de los Invitados:"
                : "Faltan:"
              }
            </p>
            <CardContent className="p-0 w-full pb-6">
            <div className="relative mb-6">
              <div className="w-full">
                {timeLeft.days < 0 && timeLeft.hours < 0 && timeLeft.minutes < 0 && timeLeft.seconds < 0 ? (
                  <div className="w-full bg-black/50 py-4">
                    <div className="max-w mx-auto">
                      {mensajes.length > 0 ? (
                        <MensajesMarquee 
                          mensajes={mensajes.map(m => ({
                            id: m.id,
                            nombre: m.nombre,
                            mensaje: m.mensaje
                          }))}
                          onMensajeClick={(mensaje) => setMensajeSeleccionado(mensaje)}
                          isLoading={isLoadingMensajes}
                        />
                      ) : (
                        <div className="text-center text-gray-300 py-4">
                          <p>¡Sé el primero en dejar un mensaje para María!</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mx-6">
                    <div className="bg-white rounded-lg p-4 shadow-lg">
                      <div className="flex justify-center space-x-6">
                        <div className="text-center">
                          <span className="font-bold text-2xl sm:text-3xl block">{timeLeft.days}</span>
                          <span className="text-gray-600 text-sm">Días</span>
                        </div>
                        <div className="text-center">
                          <span className="font-bold text-2xl sm:text-3xl block">{timeLeft.hours}</span>
                          <span className="text-gray-600 text-sm">Horas</span>
                        </div>
                        <div className="text-center">
                          <span className="font-bold text-2xl sm:text-3xl block">{timeLeft.minutes}</span>
                          <span className="text-gray-600 text-sm">Min</span>
                        </div>
                        <div className="text-center">
                          <span className="font-bold text-2xl sm:text-3xl block">{timeLeft.seconds}</span>
                          <span className="text-gray-600 text-sm">Seg</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2 mb-6 text-center text-gray-300">
              <p>Sábado, 15 de Julio • 3:00 PM</p>
              <p>Calle Principal 123, Ciudad</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Button className="flex items-center px-3 justify-start bg-gray-200 text-gray-800 hover:bg-gray-300 text-center" onClick={() => window.open('https://maps.app.goo.gl/rCEnWiLTtAjtV8Fv8', '_blank')}>
                <MapPin className="mr-3 h-4 w-4 text-black text-center" /> Ubicación
              </Button>
              <Dialog open={mensajesDialogOpen} onOpenChange={setMensajesDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="flex items-center px-3 justify-start bg-gray-800 text-white hover:bg-gray-700"
                  >
                    <MessageSquare className="mr-3 h-4 w-4" /> Mensajes
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[90%] max-w-[400px] p-6 bg-white rounded-lg">
                  <DialogHeader>
                    <DialogTitle>Mensajes para María</DialogTitle>
                  </DialogHeader>
                  {isScheduleVisible ? (
                    <div className="space-y-4 mt-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                          type="text"
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                          className="mt-1 block w-full rounded-md border-[5px] border-gray-600 px-3 py-2 shadow-md focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                        <textarea
                          value={mensaje}
                          onChange={(e) => setMensaje(e.target.value)}
                          rows={4}
                          className="mt-1 block w-full rounded-md border-[1.5px] border-gray-600 px-3 py-2 shadow-md focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition-all duration-200"
                        />
                      </div>
                      <Button 
                        onClick={handleEnviarMensaje}
                        className="w-full bg-purple-500 text-white hover:bg-purple-600 mt-2"
                      >
                        Enviar mensaje
                      </Button>
                    </div>
                  ) : (
                    <p className="text-center text-gray-600 mt-2">
                      Próximamente podrás dejar un mensaje especial para María. ¡Prepara tus mejores deseos!
                    </p>
                  )}
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center px-3 justify-start w-full bg-blue-500 text-white hover:bg-blue-600">
                    <FileImage className="mr-3 h-4 w-4" /> Contenido
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[90%] max-w-[400px] p-6 bg-white rounded-lg">
                  <DialogHeader>
                    <DialogTitle>Contenido del Evento</DialogTitle>
                  </DialogHeader>
                  {isScheduleVisible ? (
                    <div className="mt-2">
                      <p className="text-gray-600 mb-4">¡Ya puedes acceder a todo el contenido del evento!</p>
                      <Button 
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => window.open('https://drive.google.com/drive/folders/1a1Nsde0Zyx9Ysk_rI7sjaGnSB93BeW1c?usp=sharing', '_blank')}
                      >
                        Ver contenido
                      </Button>
                    </div>
                  ) : (
                    <p className="text-center text-gray-600 mt-2">
                      Aquí encontrarás fotos y videos del evento. El contenido estará disponible más cerca de la fecha.
                    </p>
                  )}
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center px-3 justify-start bg-purple-500 text-white hover:bg-purple-600">
                    <Calendar className="mr-3 h-4 w-4" /> Cronograma
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[90%] max-w-[400px] p-6 bg-white rounded-lg">
                  <DialogHeader>
                    <DialogTitle>Cronograma del Evento</DialogTitle>
                  </DialogHeader>
                  {isScheduleVisible ? (
                    <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                      <ul className="list-disc list-inside space-y-2 mt-2">
                        <li>3:00 PM - Llegada de invitados</li>
                        <li>3:30 PM - Bienvenida y aperitivos</li>
                        <li>4:00 PM - Juegos y actividades</li>
                        <li>5:00 PM - Pastel y canción de cumpleaños</li>
                        <li>5:30 PM - Baile y música</li>
                        <li>7:00 PM - Cierre del evento</li>
                        <li>7:00 PM - Cierre del evento</li>
                        <li>7:00 PM - Cierre del evento</li>
                        <li>7:00 PM - Cierre del evento</li>
                        <li>7:00 PM - Cierre del evento</li>
                        <li>7:00 PM - Cierre del evento</li>
                        <li>7:00 PM - Cierre del evento</li>
                        <li>7:00 PM - Cierre del evento</li>
                        <li>7:00 PM - Cierre del evento</li>
                        <li>7:00 PM - Cierre del evento</li>
                        <li>7:00 PM - Cierre del evento</li>
                      </ul>
                    </div>
                  ) : (
                    <p className="text-center text-gray-600 mt-2">
                      El cronograma detallado del evento estará disponible más cerca de la fecha. ¡Estamos preparando sorpresas especiales para ti!
                    </p>
                  )}
                </DialogContent>
              </Dialog>
              {isRsvpEnabled && (
                <Dialog open={showRSVPModal} onOpenChange={setShowRSVPModal}>
                  <DialogTrigger asChild>
                    <Button
                      disabled={hasRSVPed}
                      className={`col-span-2 ${hasRSVPed ? 'bg-green-200 text-green-800 justify-center' : 'bg-green-500 text-white hover:bg-green-600 justify-center'}`}
                    >
                      <Check className="mr-3 h-4 w-4" /> {hasRSVPed ? 'Asistencia confirmada' : 'Asistiré'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[90%] max-w-[400px] p-6 bg-white rounded-lg">
                    <DialogHeader>
                      <DialogTitle>Confirmar Asistencia</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre completo
                        </label>
                        <input
                          type="text"
                          value={rsvpData.nombre}
                          onChange={(e) => setRsvpData({...rsvpData, nombre: e.target.value})}
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cantidad de personas
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={rsvpData.cantidadPersonas}
                          onChange={(e) => setRsvpData({...rsvpData, cantidadPersonas: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notas o requerimientos especiales
                        </label>
                        <textarea
                          value={rsvpData.notas}
                          onChange={(e) => setRsvpData({...rsvpData, notas: e.target.value})}
                          className="w-full px-3 py-2 border rounded-md"
                          rows={3}
                        />
                      </div>
                      <Button 
                        onClick={handleRSVPSubmit}
                        className="w-full bg-green-500 text-white hover:bg-green-600"
                      >
                        Confirmar asistencia
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            
            {showSharePreview && (
              <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-300 mb-2">Vista previa del enlace compartido:</p>
                <div className="flex items-center space-x-3 bg-gray-700 p-2 rounded">
                  <Image 
                    src="/placeholder.svg" 
                    alt="Preview" 
                    width={50}
                    height={50}
                    className="rounded" 
                  />
                  <div>
                    <p className="font-semibold text-white">Invitación: Cumpleaños de María</p>
                    <p className="text-xs text-gray-300">Celebra con nosotros el 15 de Julio</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
      <Dialog open={!!mensajeSeleccionado} onOpenChange={() => setMensajeSeleccionado(null)}>
        <DialogContent className="w-[90%] max-w-[400px] bg-white rounded-lg">
          <DialogHeader>
            <DialogTitle>Mensaje de {mensajeSeleccionado?.nombre}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[250px] overflow-y-auto p-6">
            <p className="text-gray-700 whitespace-pre-wrap break-words overflow-wrap-anywhere leading-6">
              {mensajeSeleccionado?.mensaje}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}