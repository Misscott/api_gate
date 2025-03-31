import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default {
  getDataFromToken(token) {
    return new Promise((resolve, reject) => {
      const JWT_SECRET = process.env.JWT_SECRET;
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        err ? reject(err) : resolve(decoded);
      });
    });
  },

  generateAccessToken(payload) {
    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_TIME = parseInt(process.env.JWT_TIME, 10);
    
    return jwt.sign(payload, JWT_SECRET, JWT_TIME ? {expiresIn: JWT_TIME} : {});
  },

  checkPermission(userId, action, resourceType) {
    return userRepository.findByIdWithRole(userId)
      .then(user => {
        if (!user) {
          throw new Error('User not found or obsolete');
        }
        return permissionRepository.findByRoleAndAction(user.role.id, action, resourceType)
          .then(permission => ({
            hasPermission: !!permission,
            user,
            role: user.role
          }));
      })
      .catch(error => {
        throw new Error(`Error verifying permissions: ${error.message}`);
      });
  }
};