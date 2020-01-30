module.exports = (req, res, next) => {
  console.log(req.session);
  if (req.session && req.session.logged_in) {
      next();
  } else {
      res.status(403).json({message: 'your session has expired.'});
  }
};