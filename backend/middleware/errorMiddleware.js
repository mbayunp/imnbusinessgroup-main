// middleware/errorMiddleware.js
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404); // Set status ke 404
    next(error); // Teruskan error ke middleware error handler
};

const errorHandler = (err, req, res, next) => {
    // Tentukan status code: jika response status masih 200 (default), ubah ke 500
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode); // Set status response

    // Kirim response JSON dengan pesan error dan stack trace (jika bukan produksi)
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export {
    notFound,
    errorHandler,
};