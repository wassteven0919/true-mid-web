import {generateToken} from '../../../csrf.js';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function getCsrfToken(request, res) {
	// We generate csrf secret based on session.id,
	// so token for userA won't work for userB
	const csrfToken = generateToken(res, request);
	request.session.init = true;
	res.json({csrfToken});
}
