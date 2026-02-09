import express from 'express';
import dotenv from 'dotenv';
import { userRouter } from './routes/user.routes';
import { postRouter } from './routes/post.routes';
import { hashtagRouter } from './routes/hashtag.routes';
import { likeRouter } from './routes/like.routes';
import { followRouter } from './routes/follow.routes';
import { feedRouter } from './routes/feed.routes';
import { AppDataSource } from './data-source';

dotenv.config();

const app = express();
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

app.get('/', (req, res) => {
  res.send('Welcome to the Social Media Platform API! Server is running successfully.');
});

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/hashtags', hashtagRouter);
app.use('/api/likes', likeRouter);
app.use('/api/follows', followRouter);
app.use('/api/feed', feedRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
