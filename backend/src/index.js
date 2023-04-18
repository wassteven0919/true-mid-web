import path, {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import {prisma} from './adapters.js';
import rootRouter from './routes/index.js';
import {csrfErrorHandler, doubleCsrfProtection} from './csrf.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const frontendDir = path.join(__dirname, '../../frontend/dist');

const port = process.env.PORT || 8000;

const app = express();
app.use(express.static(frontendDir));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
	app.set('trust proxy', 1);
}

app.use(
	session({
		cookie: {
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: null, // Session cookie
		},
		// Use random secret
		name: 'sessionId', // Don't omit this option
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	}),
);

app.use(express.json());
app.use(cookieParser());
app.use(doubleCsrfProtection);
app.use(csrfErrorHandler);
app.use(rootRouter);

app.get('*', (request, res) => {
	if (!request.originalUrl.startsWith('/api')) {
		return res.sendFile(path.join(frontendDir, 'index.html'));
	}

	return res.status(404).send();
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});

process.on('exit', async () => {
	await prisma.$disconnect();
});
