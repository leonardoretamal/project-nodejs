import mysql from 'mysql2/promise'

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'moviesdb'
}
const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG

const connection = await mysql.createConnection(connectionString)

export class MovieModel {
  static async getAll({ genre }) {
    console.log('getAll')

    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()

      // get genre ids from database table using genre names
      const [genres] = await connection.query(
        'SELECT id, name FROM genre WHERE LOWER(name) = ?;',
        [lowerCaseGenre]
      )

      // no genre found
      if (genres.length === 0) return []

      // get the id from the first genre result
      const [{ id }] = genres

      // get movies by genre using JOIN
      const [movies] = await connection.query(
        `SELECT m.title, m.year, m.director, m.duration, m.poster, m.rate, BIN_TO_UUID(m.id) id 
         FROM movie m
         INNER JOIN movie_genres mg ON m.id = mg.movie_id
         WHERE mg.genre_id = ?;`,
        [id]
      )

      return movies
    }

    const [movies] = await connection.query(
      'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie;'
    )

    return movies
  }

  static async getById({ id }) {
    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
        FROM movie WHERE id = UUID_TO_BIN(?);`,
      [id]
    )

    if (movies.length === 0) return null

    return movies[0]
  }

  static async create({ input }) {
    const {
      genre: genreInput, // genre is an array
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    // crypto.randomUUID()
    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(
        `INSERT INTO movie (id, title, year, director, duration, poster, rate)
          VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`,
        [title, year, director, duration, poster, rate]
      )

      // Handle genres if provided
      if (genreInput && genreInput.length > 0) {
        // Get genre IDs for the provided genre names
        const placeholders = genreInput.map(() => '?').join(',')
        const [genres] = await connection.query(
          `SELECT id FROM genre WHERE name IN (${placeholders});`,
          genreInput
        )

        // Insert into movie_genres table
        for (const genre of genres) {
          await connection.query(
            'INSERT INTO movie_genres (movie_id, genre_id) VALUES (UUID_TO_BIN(?), ?);',
            [uuid, genre.id]
          )
        }
      }
    } catch (e) {
      throw new Error('Error creating movie: ' + e.message)
    }

    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
        FROM movie WHERE id = UUID_TO_BIN(?);`,
      [uuid]
    )

    return movies[0]
  }

  static async delete({ id }) {
    try {
      // First delete related records in movie_genres
      await connection.query(
        'DELETE FROM movie_genres WHERE movie_id = UUID_TO_BIN(?);',
        [id]
      )

      // Then delete the movie
      const [result] = await connection.query(
        'DELETE FROM movie WHERE id = UUID_TO_BIN(?);',
        [id]
      )

      // Check if any row was affected
      if (result.affectedRows === 0) {
        return false
      }

      return true
    } catch (e) {
      throw new Error('Error deleting movie: ' + e.message)
    }
  }

  static async update({ id, input }) {
    const {
      title,
      year,
      duration,
      director,
      rate,
      poster,
      genre: genreInput
    } = input

    // Build dynamic update query based on provided fields
    const updateFields = []
    const updateValues = []

    if (title !== undefined) {
      updateFields.push('title = ?')
      updateValues.push(title)
    }
    if (year !== undefined) {
      updateFields.push('year = ?')
      updateValues.push(year)
    }
    if (duration !== undefined) {
      updateFields.push('duration = ?')
      updateValues.push(duration)
    }
    if (director !== undefined) {
      updateFields.push('director = ?')
      updateValues.push(director)
    }
    if (rate !== undefined) {
      updateFields.push('rate = ?')
      updateValues.push(rate)
    }
    if (poster !== undefined) {
      updateFields.push('poster = ?')
      updateValues.push(poster)
    }

    // If no fields to update, return current movie
    if (updateFields.length === 0) {
      return await this.getById({ id })
    }

    updateValues.push(id) // Add id for WHERE clause

    try {
      // Update movie basic info
      await connection.query(
        `UPDATE movie 
         SET ${updateFields.join(', ')} 
         WHERE id = UUID_TO_BIN(?);`,
        updateValues
      )

      // Handle genre updates if provided
      if (genreInput !== undefined) {
        // Delete existing genres
        await connection.query(
          'DELETE FROM movie_genres WHERE movie_id = UUID_TO_BIN(?);',
          [id]
        )

        // Insert new genres if provided
        if (genreInput.length > 0) {
          const placeholders = genreInput.map(() => '?').join(',')
          const [genres] = await connection.query(
            `SELECT id FROM genre WHERE name IN (${placeholders});`,
            genreInput
          )

          for (const genre of genres) {
            await connection.query(
              'INSERT INTO movie_genres (movie_id, genre_id) VALUES (UUID_TO_BIN(?), ?);',
              [id, genre.id]
            )
          }
        }
      }

      // Return updated movie
      return await this.getById({ id })
    } catch (e) {
      throw new Error('Error updating movie: ' + e.message)
    }
  }
}