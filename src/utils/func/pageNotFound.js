
const notFound = (req, res, next) => {
    try {
        return res.status(400).send({ message: `Page not found ${req.url}` });
    } catch (err) {
        next(err);
    }
}

module.exports = notFound;