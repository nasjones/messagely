const express = require("express");
const User = require("../models/user");
const router = express.Router();
const ExpressError = require("../expressError");

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get("/", (req, res, next) => {
	try {
		if (req.user) return res.json({ users: User.all() });
		const err = new ExpressError("Unauthorized", 401);
		return next(err);
	} catch (err) {
		next(err);
	}
});

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get("/:username", (req, res, next) => {
	try {
		const { username } = req.params;
		if (req.user.username == username)
			return res.json({ users: User.get(username) });
		const err = new ExpressError("Unauthorized", 401);
		return next(err);
	} catch (err) {
		next(err);
	}
});

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/to", (req, res, next) => {
	try {
		const { username } = req.params;
		if (req.user.username == username)
			return res.json({ users: User.messagesTo(username) });
		const err = new ExpressError("Unauthorized", 401);
		return next(err);
	} catch (err) {
		next(err);
	}
});

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/from", (req, res, next) => {
	try {
		const { username } = req.params;
		if (req.user.username == username)
			return res.json({ users: User.messagesFrom(username) });
		const err = new ExpressError("Unauthorized", 401);
		return next(err);
	} catch (err) {
		next(err);
	}
});
