exports.up = function(knex) {
  return knex.schema.createTable("comments", tableBuilder => {
    tableBuilder.increments("comment_id").primary();
    tableBuilder
      .string("author")
      .references("users.username")
      .notNullable();
    tableBuilder
      .integer("article_id")
      .references("articles.article_id")
      .notNullable();
    tableBuilder.integer("votes").defaultTo(0);
    tableBuilder.timestamp("created_at").notNullable();
    tableBuilder.text("body");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("comments");
};
