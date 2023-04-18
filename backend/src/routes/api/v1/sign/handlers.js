import bcrypt from 'bcrypt';
import {prisma} from '../../../../adapters.js';

export async function signIn(request, res) {
	const {name, password} = request.body;

	if (!name) {
		return res.status(400).json({message: 'Missing required parameter: name'});
	}

	if (!password) {
		return res.status(400).json({message: 'Missing required parameter: password'});
	}

	const user = await prisma.user.findUnique({
		where: {name},
	});

	if (!user) {
		return res.status(404).json({error: 'User not found'});
	}

	const isPasswordValid = await bcrypt.compare(password, user.hashed_password);

	if (!isPasswordValid) {
		return res.status(401).json({error: 'Invalid password'});
	}

	request.session.userId = user.id;

	return res.status(200).json({name: user.name, image_url: user.image_url});
}

export async function signOut(request, res) {
	// Request.session.destroy();
	request.session.userId = null;
	return res.status(200).json({success: true});
}
