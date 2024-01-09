import express from 'express';

const router = express.Router();

router.post('/api/v1/usuario/signout', (req, res) => {
  req.session = null
  res.send({})
});

export { router as signoutRouter };
