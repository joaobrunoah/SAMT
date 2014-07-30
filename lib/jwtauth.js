/**
 * jwtauth
 *
 *  A simple middleware for parsing a JWt token attached to the request. If the token is valid, the corresponding user
 *  will be attached to the request.
 */

var url = require('url');
var UserModel = require('../models/user_model');
var jwt = require('jwt-simple');
var variables = require('./samt_variables');

module.exports = function(req, res, next){

	// Parse the URL, we might need this
	var parsed_url = url.parse(req.url, true)

	/**
	 * Take the token from:
	 * 
	 *  - the POST value access_token
	 *  - the GET parameter access_token
	 *  - the x-access-token header
	 *    ...in that order.
	 */
	var token = (req.body && req.body.access_token) || parsed_url.query.access_token || req.headers["x-access-token"];

	console.log(token);
	
	if (token) {

		try {
			var decoded = jwt.decode(token, variables.tokenSecret);

			if (decoded.exp <= Date.now()) {
				res.send(400,'Access token has expired');
				return;
			}

			UserModel.findOne({ '_id': decoded.iss }, function(err, user){

				if (!err) {					
					req.user = user;
					console.log(user.username);
					return next();
				}
			});

		} catch (err) {	
			res.send(401,err.message);
			return;
		}

	} else {
		res.send(401,'No Token');
		return;

	}
}