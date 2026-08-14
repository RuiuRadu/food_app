import app from '../backend/app.js';

export default function handler(req, res) {
  req.url = '/meals';
  return app(req, res);
}

