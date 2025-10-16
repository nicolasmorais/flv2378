
'use server';

import { sql } from '@vercel/postgres';

const initialData = [
  // Frutas Cítricas
  { title: 'GRAPEFRUIT IMP GNEL KG', content: 'PLU: 251174\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'LARANJA BAHIA IMP GNEL', content: 'PLU: 247139\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'LARANJA LIMA KG', content: 'PLU: 247269\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'LARANJA PERA GNEL', content: 'PLU: 247399\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'LARANJA PERA PARA SUCO KG', content: 'PLU: 234665\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'LIMA DA PÉRSIA GNEL', content: 'PLU: 247481\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'LIMÃO SICILIANO IMP GNEL', content: 'PLU: 247504\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'LIMÃO TAHITI GNEL', content: 'PLU: 247511\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MARACUJÁ AZEDO GNEL', content: 'PLU: 237031\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MINI TANGERINA IMPORTADA KG', content: 'PLU: 336222\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'QA LARANJA BAHIA 2KG', content: 'PLU: 4911197\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'QA LARANJA LIMA 2KG', content: 'PLU: 4911173\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'QA LARANJA PERA 3KG', content: 'PLU: 4911166\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'QA LIMÃO TAHITI 1KG', content: 'PLU: 1023185\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'TANGELINA PONKAN GNEL', content: 'PLU: 247764\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'TANGERINA CRAVO GNEL KG', content: 'PLU: 259620\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'TANGERINA DECOPON', content: 'PLU: 266406\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'TANGERINA IMPORTADA', content: 'PLU: 247757\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'TANGERINA MURKOT GNEL', content: 'PLU: 248198\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'TANGERINA NAC VERONA KG', content: 'PLU: 150491\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'TANGERINA RIO GNEL KG', content: 'PLU: 248259\nBarcode: ', category: 'Frutas', description: '', tags: [] },

  // Maçãs e Pêras
  { title: 'MAÇÃ FRANCESA CANDINE IMP CD', content: 'PLU: 755597\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MAÇÃ FUJI NAC GNEL', content: 'PLU: 247528\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MAÇÃ GALA GNEL', content: 'PLU: 247634\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MAÇÃ GOLDEN GNEL KG', content: 'PLU: 247641\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MAÇÃ PINK LANDY', content: 'PLU: 389327\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MAÇÃ RED IMP GNEL', content: 'PLU: 219617\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MAÇÃ VERDE IMP GNEL', content: 'PLU: 196574\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'PERA RED - D ANJOU IMP GNEL', content: 'PLU: 381994\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'PERA ABATE FETEL IMP KG - 3247181', content: 'PLU: 389389\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'PERA ASIÁTICA GNEL', content: 'PLU: 259729\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'PERA BELGA CONFERENCE IMP', content: 'PLU: 389341\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'PERA BOSC GNEL KG', content: 'PLU: 247993\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'PERA D ANJOU IMP GNEL', content: 'PLU: 248594\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'PERA FORELLE IMP KG', content: 'PLU: 147903\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'PERA PACKANS IMP GNEL KG', content: 'PLU: 248006\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'PERA PORTUGUESA ROCHA GNEL', content: 'PLU: 248013\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'PERA WILLIANS IMP GNEL', content: 'PLU: 248037\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  
  // Frutas Especiais
  { title: 'AMEIXA IMPORTADA KG', content: 'PLU: 248242\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'AMEIXA ROSADA', content: 'PLU: 248716\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'ATEMOYA GNEL', content: 'PLU: 248969\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'AVOCADO GNEL KG', content: 'PLU: 249645\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'CACAU KG', content: 'PLU: 19910\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'CAQUI CHOCOLATE GNEL', content: 'PLU: 250542\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'CAQUI FUYU NACIONAL GNEL', content: 'PLU: 250757\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'CAQUI IMPORTADO KG', content: 'PLU: 250696\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'CAQUI RAMAFORTE GNEL', content: 'PLU: 252249\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'CEREJA IMP KG', content: 'PLU: 250825\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'DAMASCO GRANEL KG', content: 'PLU: 251051\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'FRUTA DO CONDE GNEL', content: 'PLU: 251129\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'GOIABA BRANCA GNEL', content: 'PLU: 251136\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'GOIABA VERMELHA GNEL', content: 'PLU: 251143\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'GRANADILLA IMPORTADA CD UN', content: 'PLU: 7551710\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'GRAVIOLA GNEL KG', content: 'PLU: 258838\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'JAMELÃO', content: 'PLU: 156066\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'KIWI GOLD ZESPRI', content: 'PLU: 231404\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'KIWI IMP VERDE GNEL', content: 'PLU: 251280\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MANGA BOURBON GNEL', content: 'PLU: 220217\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MANGA ESPADA GNEL', content: 'PLU: 221566\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MANGA HADEN GNEL', content: 'PLU: 224123\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MANGA KEIT GNEL', content: 'PLU: 225434\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MANGA PALMER NAC GNEL', content: 'PLU: 227841\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MANGA ROSA GNEL', content: 'PLU: 228312\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MANGA SHELLY', content: 'PLU: 753296\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MANGA TOMMY GNEL', content: 'PLU: 248228\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MANGOSTIN KG', content: 'PLU: 225076\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'NECTARINA IMP GNEL', content: 'PLU: 260282\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'NECTARINA NAC GNEL KG', content: 'PLU: 247825\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'NOZES C/CASCA GRANEL IMP', content: 'PLU: 95426\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'PÊSSEGO IMP GNEL', content: 'PLU: 248112\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'PÊSSEGO NAC GNEL', content: 'PLU: 248150\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'PITAYA AMARELA IMP', content: 'PLU: 7551727\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'PITAYA BRANCA', content: 'PLU: 322980\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'PITAYA VERMELHA', content: 'PLU: 3285688\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'ROMÃ IMP', content: 'PLU: 259927\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'UVA VITÓRIA GNEL KG', content: 'PLU: 260008\nBarcode: ', category: 'Frutas', description: '', tags: [] },

  // Frutas Tropicais
  { title: 'ABACAXI GOLD', content: 'PLU: 1594157\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'ABACAXI HAWAI', content: 'PLU: 2173597\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'ABACAXI PÉROLA', content: 'PLU: 2173634\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'CASTANHA PORTUGUESA GNEL', content: 'PLU: 304863\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'COCO SECO GNEL', content: 'PLU: 258630\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'COCO VERDE', content: 'PLU: 1189636\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'COCO VERDE PARA GARRAFA UN', content: 'PLU: 7555565\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MELANCIA AMARELA KG', content: 'PLU: 259248\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MELANCIA BABY', content: 'PLU: 259262\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MELANCIA GRANEL KG', content: 'PLU: 238045\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MELANCIA MAGALI KG', content: 'PLU: 172691\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MELANCIA PINGO DOCE KG', content: 'PLU: 259279\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MELANCIA SOLINDA (PERSONAL)', content: 'PLU: 375016\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MELÃO AMARELO NAC GNEL', content: 'PLU: 238311\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MELÃO AMARELO REI KG', content: 'PLU: 259385\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MELÃO CANTALOUP NAC GNEL KG', content: 'PLU: 241021\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MELÃO CHARANTEAIS GNEL', content: 'PLU: 259347\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MELÃO DINO KG', content: 'PLU: 201391\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MELÃO FORMOSA GNEL KG', content: 'PLU: 108577\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MELÃO GALIA GNEL', content: 'PLU: 250382\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MELÃO MELUNA KG', content: 'PLU: 234627\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MELÃO ORANGE GNEL', content: 'PLU: 247672\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MELÃO PELE DE SAPO REI GNEL', content: 'PLU: 476041\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'MELÃO VERDE GNEL', content: 'PLU: 247740\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'QA MELÃO AMARELO KG', content: 'PLU: 158510\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'TÂMARA A GRANEL KG', content: 'PLU: 123266\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'UVA CLARA S/SEMENTE CD KG', content: 'PLU: 260176\nBarcode: ', category: 'Frutas', description: '', tags: [] },
  { title: 'UVA VERMELHA S/SEMENTE KG', content: 'PLU: 260077\nBarcode: ', category: 'Frutas', description: '', tags: [] },

  // Legumes e Verduras - Tomates
  { title: 'QA TOMATE CARM 600G', content: 'PLU: 1091922\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'QA TOMATE CEREJA 200G', content: 'PLU: 1108767\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'QA TOMATE CEREJA RAMA 200G', content: 'PLU: 4892359\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'QA TOMATE GRAPE 150G', content: 'PLU: 4414032\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'QA TOMATE GRAPE 500G', content: 'PLU: 1013021\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'QA TOMATE ITAL 500G', content: 'PLU: 1091953\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'QA TOMATE ITALIANO 1KG', content: 'PLU: 4890072\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'QA TOMATE KIDS SWEET GRAPE', content: 'PLU: 1130128\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'QA TOMATE P/MOLHO 600G', content: 'PLU: 1109696\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'TOMATE AMARELO', content: 'PLU: 280419\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'TOMATE ANDREA 600G', content: 'PLU: 1024812\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'TOMATE CAQUI GNEL KG', content: 'PLU: 337588\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'TOMATE CEREJA RAMA', content: 'PLU: 337618\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'TOMATE CEREJA VERMELHO', content: 'PLU: 280426\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'TOMATE COMUM GRANEL', content: 'PLU: 287784\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'TOMATE FONTE CORAÇÃO KG', content: 'PLU: 763844\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'TOMATE FONTE VERDE KG', content: 'PLU: 358224\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'TOMATE GRAPE', content: 'PLU: 235631\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'TOMATE ITALIANO GNEL', content: 'PLU: 357593\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  { title: 'TOMATE S GRAPE T DA MÔNICA', content: 'PLU: 3878880\nBarcode: ', category: 'Legumes e Verduras', description: '', tags: [] },
  
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
