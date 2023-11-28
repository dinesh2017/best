var fs = require('fs');
var path = require('path');

exports.getImage = (req, res, next) => {
    console.log(req.body)
    let { imageData, _name, _path, directoryName } = req.body
    if (imageData && imageData.length) {
        if (!directoryName) {
            return next(new APIError({ message: "Please provide directory name" }))
        } else if (!_path) {
            return next(new APIError({ message: "Please provide path" }))
        }
        let data = imageData
        data = data.replace(/^data:image\/png;base64,/, '');
        let filename = _name.replace(/\s+/g, '').trim()
        filename = `${new Date().getTime()}_${filename}`
        fs.writeFile(path.resolve(`${_path}/${filename}.png`), data, 'base64', function (err) {
            if (err) {
                return next(new APIError(err))
            } else {
                req.body.image = { path: `/${directoryName}/${filename}.png`, name: filename }
                return next()
            }
        });
    } else {
        return next()
    }
}