
'use server';

import { sql } from '@vercel/postgres';

const initialData = [
  // Frutas
  { title: 'ABACATE', content: 'PLU: 247023\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'ABACAXI PEROLA UND', content: 'PLU: 2173634\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'AMEIXA PRETA IMPORTADA', content: 'PLU: 248876\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'AMEIXA ROSADA NACIONAL', content: 'PLU: 248712\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'AVOCADO', content: 'PLU: 263596\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'BANANA OURO GNEL KG', content: 'PLU: 263458\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'BANANA MAÇA ORGÂNICA', content: 'PLU: 264389\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'BANANA NANICA ORGÂNICA', content: 'PLU: 264372\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'BANANA PRATA', content: 'PLU: 291050\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'BANANA TERRA', content: 'PLU: 291057\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'DAMASCO', content: 'PLU: 248594\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'FIGO', content: 'PLU: 237385\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'KIWI', content: 'PLU: 237636\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'KIWI IMPORTADO', content: 'PLU: 237640\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'LARANJA PERA', content: 'PLU: 247504\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'LARANJA PERA GNEL KG', content: 'PLU: 247509\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'LARANJA LIMA', content: 'PLU: 247503\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'LIMÃO TAHITI GNEL KG', content: 'PLU: 249051\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MAÇA FUJI NACIONAL', content: 'PLU: 247532\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MAÇA GALA NACIONAL', content: 'PLU: 247531\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MAÇA GRANNY SMITH', content: 'PLU: 247564\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MAMÃO FORMOSA', content: 'PLU: 229166\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MAMÃO PAPAYA GOLDEN GNEL KG', content: 'PLU: 229157\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MANGA HADEN', content: 'PLU: 224534\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MANGA PALMER GNEL KG', content: 'PLU: 224542\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MARACUJÁ AZEDO', content: 'PLU: 237031\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MELANCIA', content: 'PLU: 230725\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MELÃO AMARELO', content: 'PLU: 230727\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MELÃO CANTALOUPE NAC GNEL KG', content: 'PLU: 230729\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MELÃO ORANGE', content: 'PLU: 230730\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MELÃO GALEA', content: 'PLU: 230732\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MEXERICA PONKAN', content: 'PLU: 244774\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MEXERICA RIO', content: 'PLU: 245682\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'NECTARINA IMPORTADA', content: 'PLU: 260282\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'PERA ABATE', content: 'PLU: 339989\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'PERA ASIATICA', content: 'PLU: 248724\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'PERA PORT COMICE IMP GNEL KG', content: 'PLU: 259767\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'PERA PAKANS', content: 'PLU: 248708\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'PERA FORELLE IMPORTADA', content: 'PLU: 248703\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'PERA PORTUGUESA ROCHA', content: 'PLU: 248043\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'PERA RED ANJOU IMPORTADO', content: 'PLU: 248087\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'PERA WILLIANS', content: 'PLU: 248101\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'PÊSSEGO IMP GNEL KG', content: 'PLU: 248091\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'PITAYA BRANCA GNEL', content: 'PLU: 322890\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'PITAYA AMARELA NAC GNEL', content: 'PLU: 322889\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'PITAYA VERMELHA GNEL', content: 'PLU: 322891\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'ROMÃ', content: 'PLU: 291010\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'UVA TOMPOSON (GLOBE VERDE)', content: 'PLU: 2813\nBarcode: ', category: 'Frutas', description: '', tags: [] },

  // Legumes e Verduras
  { title: 'ABOBORA BATÃ', content: 'PLU: 337705\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'ABOBORA JAPONESA', content: 'PLU: 336706\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'ABOBORA MORANGA', content: 'PLU: 336707\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'ABOBORA SECA', content: 'PLU: 336698\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'ABOBORA BAHIANA', content: 'PLU: 336699\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'MINI ABOBORA PUMPKING KG', content: 'PLU: 336700\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'ABOBRINHA BRASILEIRA', content: 'PLU: 225626\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'ABOBRINHA ITALIANA', content: 'PLU: 225625\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'ABOBRINHA CHINESA', content: 'PLU: 225623\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'BATATA COMUM', content: 'PLU: 297045\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'BATATA DOCE BRANCA', content: 'PLU: 357695\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'BATATA DOCE ROXA', content: 'PLU: 357694\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'BATATA ROSADA ASTERIX', content: 'PLU: 336693\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'BETERRABA', content: 'PLU: 336691\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'CENOURA', content: 'PLU: 337815\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'CEBOLA BRANCA', content: 'PLU: 297159\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'CEBOLA NACIONAL', content: 'PLU: 257577\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'GENGIBRE', content: 'PLU: 287085\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'INHAME', content: 'PLU: 337799\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'MANDIOQUINHA', content: 'PLU: 337775\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'ALCACHOFRA GRAUDA', content: 'PLU: 2228655\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'QUIABO', content: 'PLU: 337409\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'REPOLHO VERDE', content: 'PLU: 337410\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'REPOLHO ROXO', content: 'PLU: 337411\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'TOMATE CAQUI', content: 'PLU: 337415\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'TOMATE ITALIANO', content: 'PLU: 337416\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'TOMATE HOLANDES RAMA', content: 'PLU: 337417\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'TOMATE CEREJA AMARELO', content: 'PLU: 337418\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'TOMATE GRAPE GREEN KG', content: 'PLU: 337619\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'TOMATE GRAPE', content: 'PLU: 337617\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'TOMATE CEREJA RAMA GNEL', content: 'PLU: 337618\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  
  // Plus/Cortes
  { title: 'MELANCIA CORTE', content: 'PLU: 93521\nBarcode: ', category: 'Plus/Cortes', description: '', tags: [] },
  { title: 'COCO SECO QUEBRADO', content: 'PLU: 352048\nBarcode: ', category: 'Plus/Cortes', description: '', tags: [] },
  { title: 'MELÃO REI CORTE', content: 'PLU: 25522\nBarcode: ', category: 'Plus/Cortes', description: '', tags: [] },
  { title: 'MELÃO AMARELO CORTE', content: 'PLU: 339117\nBarcode: ', category: 'Plus/Cortes', description: '', tags: [] },
  { title: 'MAMÃO FORMOSA CORTE', content: 'PLU: 84444\nBarcode: ', category: 'Plus/Cortes', description: '', tags: [] },
  { title: 'MELANCIA BABY CORTE', content: 'PLU: 39246\nBarcode: ', category: 'Plus/Cortes', description: '', tags: [] },
  { title: 'MELANCIA AMARELA CORTE', content: 'PLU: 756815\nBarcode: ', category: 'Plus/Cortes', description: '', tags: [] },
  { title: 'MELANCIA PINGO DOCE CORTE', content: 'PLU: 756822\nBarcode: ', category: 'Plus/Cortes', description: '', tags: [] },
  { title: 'MELÃO CANTALOUPE CORTE', content: 'PLU: 339261\nBarcode: ', category: 'Plus/Cortes', description: '', tags: [] },
  { title: 'MELÃO VERDE CORTE', content: 'PLU: 339087\nBarcode: ', category: 'Plus/Cortes', description: '', tags: [] },
  { title: 'MAMÃO PAPAYA CORTE', content: 'PLU: 273251\nBarcode: ', category: 'Plus/Cortes', description: '', tags: [] },
  { title: 'MELÃO ORANGE CORTE', content: 'PLU: 188021\nBarcode: ', category: 'Plus/Cortes', description: '', tags: [] },
  { title: 'MELÃO DINO CORTE', content: 'PLU: 225726\nBarcode: ', category: 'Plus/Cortes', description: '', tags: [] },
  { title: 'MELÃO GALIA CORTE', content: 'PLU: 81339\nBarcode: ', category: 'Plus/Cortes', description: '', tags: [] },
  { title: 'MELÃO CHARANTEIAS CORTE', content: 'PLU: 33664\nBarcode: ', category: 'Plus/Cortes', description: '', tags: [] },
  { title: 'ABOBORA JAPONESA CORTE', content: 'PLU: 31233\nBarcode: ', category: 'Plus/Cortes', description: '', tags: [] },
  { title: 'REPOLHO VERDE CORTE', content: 'PLU: 72137\nBarcode: ', category: 'Plus/Cortes', description: '', tags: [] },
  { title: 'ABOBORA SECA CORTE', content: 'PLU: 25379\nBarcode: ', category: 'Plus/Cortes', description: '', tags: [] },
  { title: 'ABOBORA MORANGA CORTE', content: 'PLU: 31488\nBarcode: ', category: 'Plus/Cortes', description: '', tags: [] },
  { title: 'JERIMUM LEITE CORTE', content: 'PLU: 70232\nBarcode: ', category: 'Plus/Cortes', description: '', tags: [] },
  { title: 'REPOLHO ROXO CORTE', content: 'PLU: 5357\nBarcode: ', category: 'Plus/Cortes', description: '', tags: [] },
  { title: 'ABOBORA BAIANA CORTE', content: 'PLU: 29674\nBarcode: ', category: 'Plus/Cortes', description: '', tags: [] },
  { title: 'ABOBORA COMUM CORTE', content: 'PLU: 101417\nBarcode: ', category: 'Plus/Cortes', description: '', tags: [] },
  { title: 'ABOBORA JACARÉ CORTE', content: 'PLU: 289788\nBarcode: ', category: 'Plus/Cortes', description: '', tags: [] },
  { title: 'ABOBORA BATA CORTE', content: 'PLU: 771337\nBarcode: ', category: 'Plus/Cortes', description: '', tags: [] },

  // Outros
  { title: 'ALHO GNEL', content: 'PLU: 336690\nBarcode: ', category: 'Outros', description: '', tags: [] }
];


export async function setupDatabase() {
    console.log("Setting up database...");
    try {
        // Create notes table if it doesn't exist
        await sql`
            CREATE TABLE IF NOT EXISTS notes (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT,
                description TEXT,
                category VARCHAR(255),
                tags JSONB,
                "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log("Table 'notes' is ready.");

        // Check if there is any data in notes
        const { rowCount: notesRowCount } = await sql`SELECT * from notes`;

        if (notesRowCount === 0) {
            console.log("No data found in 'notes'. Seeding initial data...");
            // Seed initial data for notes
            for (const note of initialData) {
                await sql`
                    INSERT INTO notes (title, content, category, description, tags)
                    VALUES (${note.title}, ${note.content}, ${note.category}, ${note.description}, ${JSON.stringify(note.tags)})
                `;
            }
            console.log("Initial data for 'notes' seeded successfully.");
        } else {
            console.log("Table 'notes' already contains data. Skipping seed.");
        }

    } catch (error) {
        console.error("Error setting up database:", error);
        // Don't throw error, as it might be a connection issue that resolves later.
        // The app should still try to run.
    }
}
