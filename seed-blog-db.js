const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

const articles = [
    {
        title: "Excavadoras Zoomlion 21 Toneladas: La Mejor Opción para Minería en el Chocó",
        slug: "excavadoras-zoomlion-21-toneladas-mineria-choco-cauca",
        excerpt: "Descubre por qué la excavadora Zoomlion de 21 toneladas se ha convertido en el equipo de movimiento de tierras preferido para los exigentes terrenos mineros del Chocó y el Cauca colombiano.",
        content: `
            <p>La minería y la infraestructura en el pacífico colombiano enfrentan desafíos únicos: terrenos inestables, alta humedad y jornadas de trabajo extenuantes. En este escenario, elegir la maquinaria adecuada no es un lujo, es una necesidad de supervivencia empresarial. Hoy analizaremos por qué las <strong>Excavadoras Zoomlion de 21 Toneladas (ZE210E)</strong> están liderando el mercado en el Chocó y el Cauca.</p>
            
            <h2>Rendimiento Comprobado en Terrenos Difíciles</h2>
            <p>El terreno del Chocó exige equipos robustos. Las excavadoras Zoomlion de esta gama vienen equipadas con motores Cummins de última generación, diseñados para entregar el máximo torque a bajas revoluciones y un sistema hidráulico Kawasaki japonés que garantiza una operación suave pero con una fuerza de excavación insuperable en tierras arcillosas.</p>
            
            <h2>Eficiencia de Combustible: Clave de la Rentabilidad</h2>
            <p>Uno de los factores que más destacan nuestros clientes es la <strong>economía de combustible</strong>. El sistema de control electrónico inteligente ajusta automáticamente la potencia del motor según la carga de trabajo, reduciendo el consumo hasta en un 15% comparado con otras marcas, lo que en una operación 24/7 en una mina representa millones de pesos ahorrados al mes.</p>
            
            <ul>
                <li>Cabina reforzada FOPS/ROPS, crucial para la seguridad en laderas.</li>
                <li>Fácil acceso a puntos de mantenimiento (importante en zonas remotas).</li>
                <li>Tren de rodaje con acero de alta resistencia contra la abrasión.</li>
            </ul>

            <h2>Conclusión</h2>
            <p>Si tu proyecto minero o de construcción requiere mover grandes volúmenes de tierra de manera continua y rentable, invertir en una excavadora Zoomlion 21T es una decisión inteligente. En <strong>Consumaquinayequipos</strong> somos especialistas en la distribución de estos equipos, asegurando no solo la venta, sino el acompañamiento que tu operación necesita.</p>
        `,
        featured_image: "/zoomlion.png",
        author: "Equipo Consumaquina",
        tags: ["Minería", "Zoomlion", "Chocó"],
        meta_title: "Excavadoras Zoomlion 21 Toneladas para Minería en Chocó",
        meta_description: "Análisis y ventajas de las excavadoras Zoomlion de 21 toneladas para proyectos mineros y movimiento de tierra en Chocó y Cauca, Colombia.",
        is_published: true
    },
    {
        title: "Guía de Mantenimiento Preventivo para Excavadoras en Colombia",
        slug: "guia-mantenimiento-preventivo-excavadoras-colombia",
        excerpt: "Evita costosos paros operativos. Conoce nuestra lista de chequeo esencial para el mantenimiento preventivo de excavadoras y maquinaria pesada operando en condiciones extremas.",
        content: `
            <p>Un equipo detenido por un daño prevenible es el peor enemigo de la rentabilidad en cualquier proyecto de infraestructura. El mantenimiento preventivo no es un gasto, es la mejor inversión para prolongar la vida útil de tu inversión en maquinaria pesada.</p>

            <h2>¿Por qué fallan los equipos prematuramente?</h2>
            <p>En nuestra experiencia atendiendo el mercado del Cauca y el Valle, hemos detectado que más del 70% de las averías mayores en excavadoras se deben a negligencia en los rutinas diarias. La contaminación de aceites, la falta de engrase en puntos pivote y la saturación de filtros por el polvo son los tres principales culpables.</p>

            <h2>Lista de Chequeo Diaria Imparable</h2>
            <ol>
                <li><strong>Revisión de fluidos:</strong> Nivel de aceite del motor, aceite hidráulico y refrigerante antes del arranque en frío.</li>
                <li><strong>Engrase de implementos:</strong> Pasadores del balde, el brazo y la pluma ameritan lubricación diaria para evitar desgaste prematuro del metal.</li>
                <li><strong>Inspección visual del tren de rodaje:</strong> Limpiar el exceso de barro y revisar la tensión de las orugas. Una oruga demasiado tensa destruirá los mandos finales.</li>
                <li><strong>Drenaje de agua:</strong> Purgar el separador de agua del sistema de combustible (vital con la calidad del diésel en algunas zonas remotas).</li>
            </ol>

            <h2>El Valor de los Insumos Originales</h2>
            <p>No ahorres centavos para perder millones. Utilizar filtros y aceites que cumplan exactamente con las especificaciones del fabricante (como los requeridos por los motores Cummins en equipos Zoomlion) es crítico. En Consumaquinayequipos, siempre asesoramos a nuestros clientes sobre las rutinas y el abastecimiento correcto para asegurar que su maquinaria nunca pare de producir.</p>
        `,
        featured_image: "https://consumaquinayequipos.com/wp-content/uploads/2023/11/WhatsApp-Image-2023-11-20-at-3.08.35-PM.jpeg",
        author: "Técnicos Consumaquina",
        tags: ["Mantenimiento", "Guías"],
        meta_title: "Guía de Mantenimiento para Excavadoras - Consumaquinayequipos",
        meta_description: "Aprenda cómo realizar el mantenimiento preventivo correcto a su maquinaria pesada para evitar fallas costosas en sus proyectos en Colombia.",
        is_published: true
    },
    {
        title: "Alquiler vs Compra de Maquinaria Pesada: ¿Qué conviene más?",
        slug: "alquiler-vs-compra-maquinaria-pesada-colombia",
        excerpt: "Una de las decisiones financieras más importantes para un contratista es si comprar o alquilar sus equipos de construcción. Analizamos los factores clave para tomar la decisión correcta.",
        content: `
            <p>Al iniciar un nuevo proyecto de construcción de vías o una concesión minera, una de las preguntas recurrentes que nuestros clientes nos hacen en <strong>Consumaquinayequipos</strong> es: <em>"¿Me conviene más alquilar o comprar la excavadora?"</em>. La respuesta depende directamente del horizonte y naturaleza de tu proyecto.</p>

            <h2>Ventajas de Comprar Maquinaria Pesada</h2>
            <p>La compra directa (o vía leasing) es la mejor ruta si tienes asegurado un flujo de trabajo a mediano y largo plazo (más de 18 meses continuos). Las ventajas incluyen:</p>
            <ul>
                <li><strong>Retorno de Inversión (ROI):</strong> A la larga, el equipo se paga solo y pasa a ser un activo de tu empresa, el cual puedes revender después.</li>
                <li><strong>Disponibilidad Total:</strong> El equipo es tuyo. No tienes que esperar a que una empresa de alquiler tenga disponibilidad.</li>
                <li><strong>Costos fijos:</strong> Tus únicas preocupaciones mensuales son las cuotas (si está financiada) y el mantenimiento.</li>
            </ul>

            <h2>Cuándo optar por el Alquiler</h2>
            <p>El alquiler tiene sentido para trabajos muy específicos y de corta duración (menos de 6 meses) donde la utilización de una máquina no justifica su adquisición permanente. También evita gastos de inactividad, seguros y depreciación acelerada.</p>

            <h2>El Punto Medio Estratégico</h2>
            <p>Muchos de nuestros clientes más exitosos en el Chocó y Cauca combinan ambas estrategias: adueñarse de la <strong>flota principal (ej. Excavadoras de 21 Toneladas)</strong> que utilizan el 100% del tiempo, y alquilar equipos complementarios (ej. Rodillos compactadores) solo cuando el proyecto lo exige.</p>

            <p>Independientemente de tu estrategia, un inventario confiable y respaldado es esencial. Si estás considerando la adquisición de un equipo nuevo o un modelo destacado de entrega inmediata, visita nuestro catálogo.</p>
        `,
        featured_image: "https://consumaquinayequipos.com/wp-content/uploads/2023/11/WhatsApp-Image-2023-11-20-at-3.08.34-PM.jpeg",
        author: "Asesor Comercial",
        tags: ["Inversión", "Constructoras"],
        meta_title: "Compra vs Alquiler de Maquinaria Pesada - Consejos",
        meta_description: "¿Comprar o alquilar maquinaria en Colombia? Analizamos las ventajas y en qué escenarios conviene adquirir excavadoras propias para tu empresa.",
        is_published: true
    }
];

async function seedBlog() {
    console.log('Connecting to Vercel Postgres to inject SEO articles...');
    
    try {
        for (const post of articles) {
            // Check if post exists to avoid duplicates on re-runs
            const exists = await sql`SELECT id FROM blog_posts WHERE slug = ${post.slug}`;
            
            if (exists.rowCount === 0) {
                await sql`
                    INSERT INTO blog_posts (
                        title, slug, excerpt, content, featured_image, 
                        author, is_published, tags, meta_title, meta_description
                    ) VALUES (
                        ${post.title}, ${post.slug}, ${post.excerpt}, ${post.content}, 
                        ${post.featured_image}, ${post.author}, ${post.is_published}, 
                        ${post.tags}, ${post.meta_title}, ${post.meta_description}
                    )
                `;
                console.log("✅ Inserted: ", post.title);
            } else {
                console.log("⚠️ Skipped (already exists): ", post.title);
            }
        }
        console.log('✅ Seed completed successfully!');
    } catch (error) {
        console.error('❌ Failed to seed blog posts:', error);
    }
}

seedBlog();
