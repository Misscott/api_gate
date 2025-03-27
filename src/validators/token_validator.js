import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const authenticateToken = (req, res, next) => {
    const JWT_SECRET = process.env.JWT_SECRET;

    const token = req.header('Authorization')?.replace('Bearer ', '');
  
    if (!token) {
      return res.status(403).json({ message: 'Access denied. No token provided.' });
    }
  
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
      }
  
      req.user = user;  
      next(); 
    });
  };

  generateSocketAccessToken = ({payload}) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_TIME = parseInt(process.env.JWT_TIME, 10);

    return jwt.sign(payload, JWT_SECRET, JWT_TIME ? {expiresIn: JWT_TIME} : {});
  }

  export {authenticateToken}