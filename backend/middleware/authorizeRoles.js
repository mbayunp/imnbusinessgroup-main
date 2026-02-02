const authorizeRoles = (...roles) => {
    const allowedRoles = roles.flat(); // <--- PASTIKAN BARIS INI ADA
    // console.log('AuthorizeRoles: Expected roles for this route (flattened):', allowedRoles); // Debugging
    return (req, res, next) => {
        if (!req.user) {
            // console.log('AuthorizeRoles: req.user is missing. This should not happen after protect middleware.'); // Debugging
            return res.status(401).json({ message: 'Not authorized, user not authenticated' });
        }
        // console.log('AuthorizeRoles: User role from req.user:', req.user.role); // Debugging

        if (!allowedRoles.includes(req.user.role)) {
            // console.log('AuthorizeRoles: User role NOT ALLOWED. User role:', req.user.role, 'Allowed roles:', allowedRoles); // Debugging
            return res.status(403).json({ message: `Forbidden: User with role ${req.user.role} is not allowed to access this resource` });
        }

        // console.log('AuthorizeRoles: User role IS ALLOWED:', req.user.role); // Debugging
        next();
    };
};

export { authorizeRoles };