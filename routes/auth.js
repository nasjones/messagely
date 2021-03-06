const express = require("express");
const User = require("../models/user");
const router = express.Router();

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

router.post("/login", (req, res, next) => {
	try {
		const { username, password } = req.body;
		if (User.authenticate(username, password)) {
			User.updateLoginTimestamp(username);
			let token = jwt.sign({ username }, SECRET_KEY);
			return res.json({ token });
		}
	} catch (err) {
		next(err);
	}
});

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post("/register", (req, res, next) => {
	try {
		const { username, password, first_name, last_name, phone } = req.body;
		User.register(username, password, first_name, last_name, phone);
		let token = jwt.sign({ username }, SECRET_KEY);
		return res.json({ token });
	} catch (err) {
		next(err);
	}
});

module.exports = router;
