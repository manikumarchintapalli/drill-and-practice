// src/data/keyPoints.ts

export interface TopicKeyPoints {
  title: string;
  points: string[];
}

const keyPointsData: Record<string, TopicKeyPoints> = {
  "joins": {
    title: "Joins",
    points: [
      "Joins combine rows from two or more tables based on related columns.",
      "INNER JOIN returns only matching rows between tables.",
      "LEFT JOIN returns all rows from the left table, with matched rows from the right.",
      "RIGHT JOIN returns all rows from the right table, with matched rows from the left.",
      "FULL OUTER JOIN returns all rows when there's a match in either table.",
      "CROSS JOIN returns the Cartesian product of the two tables.",
      "SELF JOIN is used to join a table to itself using aliases.",
      "JOIN conditions are usually specified using the ON keyword.",
      "Natural Join automatically joins columns with the same name.",
      "Joins help in reducing data redundancy and improving query structure.",
    ],
  },
  "relational-algebra": {
    title: "Relational Algebra",
    points: [
      "Relational Algebra is a procedural query language in DBMS.",
      "It operates on relations and returns relations as output.",
      "SELECT (σ) is used to filter rows (tuples).",
      "PROJECT (π) is used to select specific columns (attributes).",
      "UNION (∪) combines tuples from two relations, removing duplicates.",
      "SET DIFFERENCE (−) returns tuples in one relation but not in another.",
      "CARTESIAN PRODUCT (×) combines all tuples from both relations.",
      "RENAME (ρ) assigns new names to relations or attributes.",
      "JOIN combines related tuples from different relations.",
      "Relational Algebra serves as the theoretical foundation for SQL.",
    ],
  },
  "aggregate-functions": {
    title: "Aggregate Functions",
    points: [
      "Aggregate functions perform calculations on multiple rows.",
      "COUNT() returns the number of rows.",
      "SUM() calculates the total of a numeric column.",
      "AVG() returns the average of a numeric column.",
      "MAX() finds the highest value in a column.",
      "MIN() finds the lowest value in a column.",
      "Aggregate functions often work with GROUP BY to summarize data.",
      "They can be used with HAVING to filter grouped results.",
      "NULL values are ignored in most aggregate functions.",
      "They help in reporting and analytical queries.",
    ],
  },
  "subqueries": {
    title: "Subqueries",
    points: [
      "Subqueries are nested queries inside another SQL query.",
      "They can return single or multiple values.",
      "Used in SELECT, FROM, or WHERE clauses.",
      "Scalar subqueries return a single value.",
      "Row subqueries return a single row with multiple columns.",
      "Table subqueries return a full result set and can be used like a table.",
      "Subqueries can be correlated or non-correlated.",
      "Correlated subqueries reference outer query columns.",
      "They can be used to compare values using IN, EXISTS, or comparison operators.",
      "Subqueries improve modularity and query reusability.",
    ],
  },
  "nested-queries": {
    title: "Nested Queries",
    points: [
      "Nested queries are another term for subqueries.",
      "They allow complex filtering or result evaluation.",
      "Used to perform multiple levels of logic in a single query.",
      "INNER nested queries are evaluated first.",
      "Can be placed inside SELECT, WHERE, or HAVING clauses.",
      "Nested queries can help avoid temporary tables.",
      "They support dynamic filtering based on aggregated data.",
      "Correlated nested queries execute for each row of the outer query.",
      "EXISTS and NOT EXISTS are commonly used in nested queries.",
      "Improve query flexibility but may affect performance if not optimized.",
    ],
  },
};

export default keyPointsData;