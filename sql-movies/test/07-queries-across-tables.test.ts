import { Database } from "../src/database";
import { minutes } from "./utils";

describe("Queries Across Tables", () => {
  let db: Database;

  beforeAll(async () => {
    db = await Database.fromExisting("06", "07");
  }, minutes(3));

  it(
    "should select top three directors ordered by total budget spent in their movies",
    async done => {
      const query = `SELECT directors.full_name AS director, ROUND(SUM(movies.budget_adjusted),2) AS total_budget
                      FROM directors
                      JOIN movie_directors ON movie_directors.director_id = directors.id
                      JOIN movies ON movies.id = movie_directors.movie_id
                      GROUP BY directors.full_name
                      ORDER BY total_budget DESC
                      LIMIT 3`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          director: "Ridley Scott",
          total_budget: 722882143.58
        },
        {
          director: "Michael Bay",
          total_budget: 518297522.1
        },
        {
          director: "David Yates",
          total_budget: 504100108.5
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select top 10 keywords ordered by their appearance in movies",
    async done => {
      const query = `SELECT keywords.keyword AS keyword, COUNT(movie_keywords.keyword_id) AS count
                      FROM keywords
                      JOIN movie_keywords ON movie_keywords.keyword_id = keywords.id
                      GROUP BY movie_keywords.keyword_id
                      ORDER BY count DESC
                      LIMIT 10`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          keyword: "woman director",
          count: 162
        },
        {
          keyword: "independent film",
          count: 115
        },
        {
          keyword: "based on novel",
          count: 85
        },
        {
          keyword: "duringcreditsstinger",
          count: 82
        },
        {
          keyword: "biography",
          count: 78
        },
        {
          keyword: "murder",
          count: 66
        },
        {
          keyword: "sex",
          count: 60
        },
        {
          keyword: "revenge",
          count: 51
        },
        {
          keyword: "sport",
          count: 50
        },
        {
          keyword: "high school",
          count: 48
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select one movie which has highest count of actors",
    async done => {
      const query = `SELECT movies.original_title, COUNT(movie_actors.actor_id) AS count
                      FROM movies
                      JOIN movie_actors ON movie_actors.movie_id = movies.id
                      GROUP BY movies.original_title
                      ORDER BY count DESC
                      LIMIT 1`;
      const result = await db.selectSingleRow(query);

      expect(result).toEqual({
        original_title: "Life",
        count: 12
      });

      done();
    },
    minutes(3)
  );

  it(
    "should select three genres which has most ratings with 5 stars",
    async done => {
      const query = `SELECT genres.genre , COUNT(movie_ratings.rating) AS five_stars_count
      FROM movie_ratings
      JOIN movies ON movies.id = movie_ratings.movie_id
      JOIN movie_genres ON movie_genres.movie_id = movie_ratings.movie_id
      JOIN genres ON genres.id = movie_genres.genre_id
      WHERE movie_ratings.rating = 5
      GROUP BY genres.genre
      ORDER BY five_stars_count DESC
      LIMIT 3`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          genre: "Drama",
          five_stars_count: 15052
        },
        {
          genre: "Thriller",
          five_stars_count: 11771
        },
        {
          genre: "Crime",
          five_stars_count: 8670
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select top three genres ordered by average rating",
    async done => {
      const query = `SELECT genres.genre, ROUND(AVG(movie_ratings.rating),2) AS avg_rating
                      FROM movie_ratings
                      JOIN movies ON movies.id = movie_ratings.movie_id
                      JOIN movie_genres ON movie_genres.movie_id = movie_ratings.movie_id
                      JOIN genres ON genres.id = movie_genres.genre_id
                      GROUP BY genres.genre
                      ORDER BY avg_rating DESC
                      LIMIT 3`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          genre: "Crime",
          avg_rating: 3.79
        },
        {
          genre: "Music",
          avg_rating: 3.73
        },
        {
          genre: "Documentary",
          avg_rating: 3.71
        }
      ]);

      done();
    },
    minutes(3)
  );
});
