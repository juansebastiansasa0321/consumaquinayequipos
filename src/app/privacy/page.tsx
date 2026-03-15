import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold text-white mb-6">Política de Privacidad</h1>
          
          <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <p><strong>Última actualización:</strong> Marzo 2026</p>
            
            <section>
                <h2 className="text-xl font-bold text-white mb-3">1. Información que Recopilamos</h2>
                <p>En Consumaquinayequipos recopilamos información personal únicamente cuando tú nos la proporcionas directamente al crear una cuenta o conectarte a través de servicios de terceros como Google o Facebook. Esta información incluye:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Nombre completo</li>
                    <li>Dirección de correo electrónico</li>
                    <li>Identificadores públicos de perfil provistos por Google o Facebook</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-3">2. Cómo Usamos tu Información</h2>
                <p>Utilizamos tu información registrada exclusivamente para proveerte acceso seguro a nuestro panel de publicaciones ("Dashboard"), permitirte listar o gestionar tu maquinaria pesada, y para comunicarnos contigo en caso de requerimientos de soporte o actualizaciones de términos del servicio.</p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-3">3. Terceros y Servicios Conectados</h2>
                <p>Nuestra plataforma integra flujos de autenticación de terceros (OAuth) para agilizar el ingreso:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><strong>Facebook (Meta):</strong> Al iniciar sesión con Facebook, solicitamos únicamente acceso a tu Nombre y Correo Electrónico. No publicamos en tu biografía ni accedemos a tus contactos u otra información privada.</li>
                    <li><strong>Google:</strong> Al igual que con Facebook, limitamos la extracción de datos al correo electrónico básico necesario para la creación del perfil.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-3">4. Eliminación de tus Datos</h2>
                <p>Si deseas eliminar permanentemente tu cuenta y toda la información asociada (incluyendo tus publicaciones de maquinaria, perfil y vinculaciones con Facebook/Google), puedes hacerlo visitando nuestra <Link href="/data-deletion" className="text-brand-yellow hover:underline">página de instrucciones de eliminación de datos</Link> o solicitándolo directamente al correo <strong>consumaquinayequipos@icloud.com</strong>.</p>
            </section>

             <section>
                <h2 className="text-xl font-bold text-white mb-3">5. Seguridad</h2>
                <p>Implementamos prácticas recomendadas en la industria, como cifrado de contraseñas mediante Bcrypt y manejo de sesiones con tokens seguros (JWT HTTP-Only), para prevenir el acceso no autorizado a tu cuenta. No compartimos, vendemos, ni alquilamos tus correos electrónicos a terceros bajo ninguna circunstancia ajena al funcionamiento del propio catálogo.</p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
