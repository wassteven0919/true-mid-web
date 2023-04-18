import bcrypt from 'bcrypt';
import {prisma} from '../../../../adapters.js';

export async function getAllUsers(request, res) {
	try {
		const allUsers = await prisma.user.findMany({
			select: {
				name: true,
			},
		});

		return res.json(allUsers);
	} catch (error) {
		console.error(error);
		return res.status(500).json({error: 'Error fetching users'});
	}
}

// Update user's image_url to db
export async function updateUser(request, res) {
	const {name, image_url} = request.body;

	try {
	    const user = await prisma.user.findUnique({where: {name}});
		// If user exist, update image_url
		const updatedUser = await prisma.user.update({
			where: {name: user.name},
			data: {image_url},
		});
		// If user does not exis return error
		if (user === null) {
			return res.status(404).json({error: 'User not found'});
		}

		return res.status(200).json(updatedUser);
	} catch (error) {
		console.error(error);
		return res.status(500).json({error: 'Error fetching users'});
	}
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function createOneUser(request, res) {
	const {name, password} = request.body;

	if (!name || !password) {
		return res.status(400).json({error: 'Username and password are required'});
	}

	try {
		const salt = await bcrypt.genSalt(10);
 		const hashedPassword = await bcrypt.hash(password, salt);

		const existingUser = await prisma.user.findUnique({
			where: {name},
		});

		if (existingUser) {
			return res.status(200).json({Message: 'User exist.'});
		}

		const newUser = await prisma.user.create({
			data: {
    				name,
				hashed_password: hashedPassword,
			},
		});
		return res.status(201).json(newUser.name);
	} catch (error) {
		console.error(error);
		return res.status(500).json({error: 'Error creating user'});
	}
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function getOneUser(request, res) {
	const id = Number.parseInt(request.params.id);
	if (isNaN(id)) {
		return res.status(400).json({error: 'Invalid id'});
	}

	const user = await prisma.user.findUnique({where: {id}});
	if (user === null) {
		return res.status(404).json({error: 'Not Found'});
	}

	return res.json(user);
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function deleteUser(request, res) {
	const id = Number.parseInt(request.params.id);

	if (isNaN(id)) {
		return res.status(400).json({error: 'Invalid id'});
	}

	const user = await prisma.user.findUnique({where: {id}});

	if (user === null) {
		 return res.status(404).json({error: 'User not found'});
	}

	await prisma.user.delete({where: {id}});
	return res.status(204).send();
}
