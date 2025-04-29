import express from 'express';
import dotenv from 'dotenv';
import { userRouter } from './routes/user.routes';
import { postRouter } from './routes/post.routes';
import { feedRouter } from './routes/feed.routes';
import { AppDataSource } from './data-source';
import { errorHandler } from './middleware/error.middleware';
import { requestLogger } from './middleware/logging.middleware';

dotenv.config();

const app = express();

app.use(express.json());
app.use(requestLogger);

// URL patterns matching README specifications
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/feed', feedRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
