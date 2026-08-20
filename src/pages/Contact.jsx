import React, { useState } from 'react';
import { MessageCircle, Send, Sparkles } from 'lucide-react';

const Contact = () => {
  const [userMessage, setUserMessage] = useState('');
  const whatsappNumber = "543482592880";

  const handleWhatsAppRedirect = (e) => {
    e.preventDefault();
    const messageText = userMessage.trim() 
      ? `¡Hola OttoLab! ${userMessage}`
      : "¡Hola! Quería realizar una consulta desde la web de OttoLab.";
    
    const encodedMessage = encodeURIComponent(messageText);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
      
      {/* Sombra/Resplandor muy suave en verde sobrio para fondo claro */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-50/60 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-2xl w-full mx-auto space-y-10">
        
        {/* Encabezado */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Atención Directa</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
            Contactate con <span className="text-emerald-700">nosotros</span>
          </h1>
          
          <p className="text-zinc-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            ¿Tenés alguna duda o querés pedir un presupuesto personalizado? Mandanos un mensaje directo a nuestro WhatsApp.
          </p>
        </div>

        {/* Tarjeta Interactiva de WhatsApp */}
        <div className="bg-white/80 backdrop-blur-md border border-zinc-200/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300">
          <div className="space-y-6">
            
            {/* Cabecera de la tarjeta */}
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                En línea
              </span>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-zinc-900">Escribinos tu consulta</h2>
              <p className="text-zinc-500 text-xs sm:text-sm mt-1">
                Podés redactar tu mensaje acá abajo o presionar directamente el botón para iniciar el chat.
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleWhatsAppRedirect} className="space-y-4">
              <div>
                <textarea
                  rows="4"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Ej: Hola! Quisiera cotizar una impresión 3D personalizada..."
                  className="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl p-3.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-medium py-3 px-5 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-sm active:scale-[0.99]"
              >
                <Send className="w-4 h-4" />
                <span className="text-sm">Enviar mensaje por WhatsApp</span>
              </button>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;