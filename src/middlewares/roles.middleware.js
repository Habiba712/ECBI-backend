const checkRole =(allowedRoles)=> {
  return (req, res, next) => {
    // Assuming user roles are stored in req.user.roles after authentication
    const role = req.user.role;

    const hasPermission = allowedRoles.includes(role);

    if (hasPermission) {
    next(); // User has the required role, proceed
    } else {
      res.status(403).send('Forbidden: Insufficient permissions'); // Deny access
    }
  };
}

module.exports = checkRole;