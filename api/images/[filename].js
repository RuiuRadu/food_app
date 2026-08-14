import app from '../../backend/app.js';

export default function handler(req, res) {
  req.url = `/images/${req.query.filename}`;
  return app(req, res);
}
