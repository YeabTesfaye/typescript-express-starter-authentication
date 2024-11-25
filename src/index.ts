import dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';
import express, { Request, Response } from 'express';
const app = express();

// Rest of packages
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

// Security Package
import cors from 'cors';
import helmet from 'helmet';

// Routes
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';

// Middleware
import notFoundMiddleware from './middleware/notFound';
import errorHandlerMiddlewar from './middleware/errorHandler';

// SwaggerUI
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp',
  }),
);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get('/', (_req: Request, res: Response) => {
  res.send('Authentication and Authorization with Typescript');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddlewar);

const PORT = process.env.PROT || 3000;
app.listen(PORT, () => console.log(`The server is listing at port ${PORT}`));
