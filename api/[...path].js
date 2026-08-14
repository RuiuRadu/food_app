import app from '../backend/app.js';

export default function handler(req, res) {
  req.url = req.url.replace(/^\/api/, '') || '/';

  return app(req, res);
}