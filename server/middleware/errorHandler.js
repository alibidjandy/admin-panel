const errorHandler = (err, req, res, next) => {
  // Log the error for debugging purposes
  console.error(err.stack);

  // Send a formatted error response to the client
  res.status(500).json({
    message: "Something went wrong!",
    error: err.message,
  });
};

module.exports = errorHandler;
