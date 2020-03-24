import express from 'express';
import * as bodyParser from 'body-parser';
import { connect } from "./db/db";
import { Movie } from "./db/models/Movie.model";

connect();

const app = express();

app.use(bodyParser.json({
  limit: '50mb',
  verify(req: any, res, buf, encoding) {
    req.rawBody = buf;
  },
}));

app.get('/', (req, res) => res.send('Hello World!'));


// Creation
app.post('/movies', async (req, res) => {
  const movie = new Movie();
  movie.title = req.body.title;
  movie.plot_summary = req.body.plot_summary;
  movie.duration = req.body.duration;
  await movie.save();
  res.send(movie);
});

// Read
app.get('/movies', async (req, res) => {
  const movies = await Movie.find();
  res.send(movies);
});

app.get('/movies/:id', async (req, res) => {
  const movie = await Movie.findOne({
    where: {
      id: req.params.id
    }
  });
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).send({ message: "Movie not found" })
  }
});

// update
app.put('/movies/:id', async (req, res) => {
  const movie = await Movie.findOne({
    where: {
      id: req.params.id
    }
  });
  if (movie) {
    if (req.body.title) {
      movie.title = req.body.title;
    }
    if (req.body.plot_summary) {
      movie.plot_summary = req.body.plot_summary;
    }
    if (req.body.duration) {
      movie.duration = req.body.duration;
    }
    await movie.save();
    res.send(movie);
  } else {
    res.status(404).send({ message: "Movie not found" })
  }
});

// delete
app.delete('/movies/:id', async (req, res) => {
  const movie = await Movie.findOne({
    where: {
      id: req.params.id
    }
  });
  if (movie) {
    await movie.remove();
    res.json({ message: 'Movie deleted' });
  } else {
    res.status(404).send({ message: "Movie not found" })
  }
});
export { app };
