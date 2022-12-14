exports.customErrorHandler = (err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Misformed Request Body" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Not Found" });
  } else if (err.code === "22003") {
    res.status(400).send({ msg: "Out Of Range For Type Integer" });
  } else {
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

// 22003 -  out of range for type integer
// 23503 -  violates foreign key constraint

exports.routeNotFound404 = (req, res) => {
  res.status(404).send({ msg: "Route not found" });
};
