exports.up = function(knex) {
  return knex.schema.createTable("articles", tableBuilder => {
    tableBuilder.increments("article_id").primary();
    tableBuilder.string("title");
    tableBuilder.text("body");
    tableBuilder.integer("votes").defaultTo(0);
    tableBuilder
      .string("topic")
      .references("topics.slug")
      .notNullable();
    tableBuilder
      .string("author")
      .references("users.username")
      .notNullable();
    tableBuilder.timestamp("created_at").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("articles");
};
