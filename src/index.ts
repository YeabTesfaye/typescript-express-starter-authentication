import dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';
import express, { Request, Response } from 'express';
const app = express();

// Rest of packages
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// Security Package
import cors from 'cors';
import helmet from 'helmet';

// Routes
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';

// Middleware
import notFoundMiddleware from './middleware/notFound';
import errorHandlerMiddlewar from './middleware/errorHandler';


app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.get('/', (req: Request, res: Response) => {
  res.send('Authentication and Authorization with Typescript');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddlewar);

const PORT = process.env.PROT || 3000;
app.listen(PORT, () => console.log(`The server is listing at port ${PORT}`));
