import { sql } from "@vercel/postgres";

// Esquema de la Base de Datos para Máquinas
export async function createMachinesTable() {
    try {
        await sql`
      CREATE TABLE IF NOT EXISTS machines (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(15, 2),
        hours INT,
        location VARCHAR(100),
        tags TEXT[], -- Array of strings like "Oportunidad única", "En Quibdó"
        images TEXT[], -- Array of URLs mapped from Vercel Blob
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
        console.log("Tabla 'machines' creada exitosamente.");
        return { success: true };
    } catch (error) {
        console.error("Error al crear la tabla 'machines':", error);
        return { success: false, error };
    }
}

// Esquema de la Base de Datos para Contactos / Leads
export async function createContactsTable() {
    try {
        await sql`
      CREATE TABLE IF NOT EXISTS contacts (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        equipment VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'Nuevo',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
        console.log("Tabla 'contacts' creada exitosamente.");
        return { success: true };
    } catch (error) {
        console.error("Error al crear la tabla 'contacts':", error);
        return { success: false, error };
    }
}
