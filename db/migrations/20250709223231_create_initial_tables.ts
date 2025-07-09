import type { Knex } from 'knex';

// La funzione 'up' viene eseguita quando applichiamo la migrazione (con 'npx knex migrate:latest')
export async function up(knex: Knex): Promise<void> {
  // Creiamo le tabelle in un ordine logico: prima quelle che non dipendono da altre.
  
  // 1. Tabella Utenti
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary(); // ID numerico auto-incrementante (1, 2, 3...)
    table.string('username', 50).notNullable().unique(); // Nome utente, deve essere unico
    table.string('password_hash', 255).notNullable(); // Password criptata
    table.string('role', 20).notNullable().defaultTo('barista'); // Ruolo: 'manager' o 'barista'
    table.timestamps(true, true); // Aggiunge 'created_at' e 'updated_at' automaticamente
  });

  // 2. Tabella Libreria Drink
  await knex.schema.createTable('drinks_library', (table) => {
    table.increments('id').primary();
    table.string('name', 100).notNullable();
    table.text('description').nullable(); // Descrizione (opzionale)
    table.decimal('default_price', 10, 2).notNullable(); // Prezzo base suggerito
    table.boolean('is_archived').defaultTo(false); // Per "nascondere" un drink senza cancellarlo
    table.timestamps(true, true);
  });
  
  // 3. Tabella Eventi
  await knex.schema.createTable('events', (table) => {
    table.increments('id').primary();
    table.string('name', 100).notNullable().defaultTo('Serata Corrente');
    table.enu('status', ['pending', 'active', 'finished']).notNullable().defaultTo('pending'); // Stato dell'evento
    table.boolean('time_decay_enabled').defaultTo(false); // Flag per la funzione di discesa prezzo
    table.timestamps(true, true);
  });

  // 4. Tabella di collegamento Evento-Drink (la più complessa)
  await knex.schema.createTable('event_drinks', (table) => {
    table.increments('id').primary();
    
    // Foreign Key per l'evento
    table.integer('event_id').unsigned().notNullable().references('id').inTable('events').onDelete('CASCADE');
    // Foreign Key per il drink
    table.integer('drink_id').unsigned().notNullable().references('id').inTable('drinks_library').onDelete('CASCADE');
    
    table.decimal('base_price', 10, 2).notNullable();
    table.decimal('current_price', 10, 2).notNullable();
    table.integer('initial_quantity').notNullable();
    table.integer('current_quantity').notNullable();
  });

  // 5. Tabella Vendite
  await knex.schema.createTable('sales', (table) => {
    table.increments('id').primary();
    
    // Foreign Key per l'istanza del drink venduto
    table.integer('event_drink_id').unsigned().notNullable().references('id').inTable('event_drinks').onDelete('CASCADE');

    table.decimal('price_at_sale', 10, 2).notNullable();
    table.enu('status', ['completed', 'undone']).notNullable().defaultTo('completed');
    table.timestamp('timestamp').defaultTo(knex.fn.now()); // Data/ora della vendita
  });

  // 6. Tabella Log Eventi (per il manager)
  await knex.schema.createTable('event_logs', (table) => {
    table.increments('id').primary();
    table.integer('event_id').unsigned().notNullable().references('id').inTable('events').onDelete('CASCADE');
    table.timestamp('timestamp').defaultTo(knex.fn.now());
    table.string('log_level', 10).notNullable(); // 'info', 'sale', 'error'
    table.text('message').notNullable();
  });
}


// La funzione 'down' viene eseguita per annullare la migrazione (con 'npx knex migrate:rollback')
export async function down(knex: Knex): Promise<void> {
  // È FONDAMENTALE cancellare le tabelle in ordine inverso rispetto alla creazione
  // per non violare le dipendenze (foreign key).
  await knex.schema.dropTableIfExists('event_logs');
  await knex.schema.dropTableIfExists('sales');
  await knex.schema.dropTableIfExists('event_drinks');
  await knex.schema.dropTableIfExists('events');
  await knex.schema.dropTableIfExists('drinks_library');
  await knex.schema.dropTableIfExists('users');
}