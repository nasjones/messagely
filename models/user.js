/** User class for message.ly */
const bcrypt = require("bcrypt");
const db = require("../db");
const ExpressError = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config");

/** User of the site. */

class User {
	/** register new user -- returns
	 *    {username, password, first_name, last_name, phone}
	 */

	static async register({
		username,
		password,
		first_name,
		last_name,
		phone,
	}) {
		let hashed = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
		let result = await db.query(
			"INSERT INTO users(username, password, first_name, last_name, phone, join_at, last_login_at) VALUES($1, $2, $3,$4, $5, current_timestamp, current_timestamp) RETURNING username, password, first_name, last_name, phone,join_at, last_login_at",
			[username, hashed, first_name, last_name, phone]
		);
		return result.rows[0];
	}

	/** Authenticate: is this username/password valid? Returns boolean. */

	static async authenticate(username, password) {
		try {
			let result = await db.query(
				"SELECT username, password FROM users where username=$1",
				[username]
			);
			let user = result.rows[0];
			if (user) {
				let output = await bcrypt.compare(password, user.password);
				return output;
			} else throw new ExpressError("Invalid user or password", 400);
		} catch (err) {
			return err;
		}
	}

	/** Update last_login_at for user */

	static async updateLoginTimestamp(username) {
		try {
			let result = await db.query(
				"UPDATE users SET last_login_at=current_timestamp WHERE username=$1 RETURNING username, last_login_at",
				[username]
			);
			let user = result.rows[0];
			if (!user) throw new ExpressError("Invalid user", 400);
			return user;
		} catch (error) {
			return err;
		}
	}

	/** All: basic info on all users:
	 * [{username, first_name, last_name, phone}, ...] */

	static async all() {
		let result = await db.query(
			"SELECT username, first_name, last_name, phone FROM users"
		);
		return result.rows;
	}

	/** Get: get user by username
	 *
	 * returns {username,
	 *          first_name,
	 *          last_name,
	 *          phone,
	 *          join_at,
	 *          last_login_at } */

	static async get(username) {
		try {
			let results = await db.query(
				"SELECT username, first_name, last_name, phone, join_at, last_login_at FROM users WHERE username=$1",
				[username]
			);
			let user = results.rows[0];
			if (!user) throw new ExpressError("Invalid user", 400);
			return user;
		} catch (err) {
			return err;
		}
	}

	/** Return messages from this user.
	 *
	 * [{id, to_user, body, sent_at, read_at}]
	 *
	 * where to_user is
	 *   {username, first_name, last_name, phone}
	 */

	static async messagesFrom(username) {
		try {
			let results = await db.query(
				`SELECT 
            t.username, 
            t.first_name, 
            t.last_name, 
            t.phone , 
            m.id, 
            m.body, 
            m.sent_at, 
            m.read_at
        FROM users AS f 
        JOIN messages AS m ON m.from_username = f.username
        JOIN users AS t ON t.username = m.to_username
        WHERE f.username = $1`,
				[username]
			);

			return results.rows.map((item) => {
				return {
					id: item.id,
					body: item.body,
					sent_at: item.sent_at,
					read_at: item.read_at,
					to_user: {
						username: item.username,
						first_name: item.first_name,
						last_name: item.last_name,
						phone: item.phone,
					},
				};
			});
		} catch (err) {
			return err;
		}
	}

	/** Return messages to this user.
	 *
	 * [{id, from_user, body, sent_at, read_at}]
	 *
	 * where from_user is
	 *   {id, first_name, last_name, phone}
	 */

	static async messagesTo(username) {
		try {
			let results = await db.query(
				`SELECT 
            f.username, 
            f.first_name, 
            f.last_name, 
            f.phone , 
            m.id, 
            m.body, 
            m.sent_at, 
            m.read_at
        FROM users AS t 
        JOIN messages AS m ON m.to_username = t.username
        JOIN users AS f ON f.username = m.from_username
        WHERE t.username = $1`,
				[username]
			);

			return results.rows.map((item) => {
				return {
					id: item.id,
					body: item.body,
					sent_at: item.sent_at,
					read_at: item.read_at,
					from_user: {
						username: item.username,
						first_name: item.first_name,
						last_name: item.last_name,
						phone: item.phone,
					},
				};
			});
		} catch (err) {
			return err;
		}
	}
}

module.exports = User;
