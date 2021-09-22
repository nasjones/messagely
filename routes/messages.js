const express = require("express");
const Message = require("../models/message");
const router = express.Router();

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get("/:id", (req, res, next) => {
	try {
		const { id } = req.params;
		return res.json({ message: Message.get(id) });
	} catch (err) {
		next(err);
	}
});

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post("/", (req, res, next) => {
	try {
		const { to_username, body } = req.body;
		const from_username = req.user.username;
		return res.json({
			message: Message.create({ from_username, to_username, body }),
		});
	} catch (err) {
		next(err);
	}
});

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post("/:id/read", (req, res, next) => {
	try {
		const { id } = req.params;
		let message = Message.get(id);
		const user = req.user.username;
		if (message.to_user == user)
			return res.json({
				message: Message.markRead(id),
			});
		return;
	} catch (err) {
		next(err);
	}
});
