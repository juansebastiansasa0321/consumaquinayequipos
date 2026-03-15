import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-brand-yellow hover:text-yellow-400 font-medium">
             <ArrowLeft className="w-4 h-4 mr-2" />
             Volver al Inicio
          </Link>
        </div>
        
        <div className="bg-neutral-800 rounded-2xl p-8 border border-neutral-700 shadow-xl">
          <h1 className="text-3xl font-bold text-white mb-6">Instrucciones para la Eliminación de Datos</h1>
          
          <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <p>Según lo exigen las políticas de desarrolladores de las plataformas de autenticación asociadas (como <strong>Facebook Meta</strong> y <strong>Google</strong>), Consumaquinayequipos te brinda el control absoluto para revocar el acceso y borrar por completo la huella digital que hayas creado en nuestra plataforma web.</p>
            
            <section>
                <h2 className="text-xl font-bold text-white mb-3">Opción 1: Solicitud de Eliminación Directa</h2>
                <p>Puedes solicitar la eliminación total e irrevocable de tu cuenta, perfil, configuraciones y toda maquinaria asociada enviando un correo electrónico directo al equipo administrativo:</p>
                
                <div className="bg-neutral-900 border border-neutral-700 p-4 rounded-lg mt-4 inline-block">
                    <p className="mb-2"><strong>Asunto del Correo:</strong> Solicitud de Eliminación de Cuenta y Datos (RGPD)</p>
                    <p className="text-white font-mono text-lg">consumaquinayequipos@icloud.com</p>
                </div>
                
                <p className="mt-4">Debes enviar el correo desde la misma dirección registrada en tu cuenta. Tu información será purgada de nuestros registros, bases de datos (PostgreSQL), e integraciones en un plazo no mayor a 48-72 horas hábiles.</p>
            </section>

             <section>
                <h2 className="text-xl font-bold text-white mt-8 mb-3">Opción 2: Revocación desde Facebook (Eliminación de Permisos)</h2>
                <p>Adicionalmente, si iniciaste sesión utilizando Facebook, puedes eliminar los permisos concedidos a nuestra aplicación directamente desde la de Meta. Para hacerlo:</p>
                <ol className="list-decimal pl-6 mt-4 space-y-2">
                    <li>Ingresa a tu cuenta de Facebook desde un navegador o la aplicación móvil.</li>
                    <li>Dirígete al apartado de <strong>Configuración y privacidad &gt; Configuración</strong>.</li>
                    <li>Busca la sección <strong>Apps y sitios web</strong>.</li>
                    <li>Localiza la aplicación denominada <strong>Consumaquinayequipos Login</strong> o afines en la lista de aplicaciones activas.</li>
                    <li>Haz clic en el botón <strong>Eliminar</strong> y confirma. Facebook cortará inmediatamente cualquier solicitud de datos nueva.</li>
                </ol>
                <p className="mt-4 text-sm text-gray-400 italic">Nota: Hacer este paso bloquea futuros inicios de sesión rápidos nuestros, pero si deseas que borremos todo el historial de los catálogos en nuestros servidores internos, debes contactarnos complementariamente vía correo según la Opt 1.</p>
            </section>
            
            <section className="mt-12 pt-6 border-t border-neutral-700 text-sm">
                 <p className="text-center">
                    Al utilizar los servicios, aceptas nuestra <Link href="/privacy" className="text-brand-yellow hover:underline">Política de Privacidad Integral</Link>.
                 </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
