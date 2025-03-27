import jwt from 'jsonwebtoken'
import config from '../config';

const authenticateToken = (req, res, next) => {
    config()
    const token = req.header('Authorization')?.replace('Bearer ', '');
  
    if (!token) {
      return res.status(403).json({ message: 'Access denied. No token provided.' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
      }
  
      req.user = user;  
      next(); 
    });
  };

  export {authenticateToken}