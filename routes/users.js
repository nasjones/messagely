const express = require("express");
const User = require("../models/user");
const router = express.Router();

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get("/", (req, res, next) => {
	try {
		return res.json({ users: User.all() });
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

		return res.json({ users: User.get(username) });
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

		return res.json({ users: User.messagesTo(username) });
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
router.get("/:username/to", (req, res, next) => {
	try {
		const { username } = req.params;

		return res.json({ users: User.messagesFrom(username) });
	} catch (err) {
		next(err);
	}
});
