var fs = require('fs');
var path = require('path');
var PhotoController = require('./controllers/photo');
var UserController = require('./controllers/user');

module.exports = function (router) {
    router.post('/addPhoto', function (req, res, next) {
        fs.readFile(req.files.imageUpload.path, function (err, data) {

            if (req.files.imageUpload.path != null && req.files.imageUpload.path != "") {
                var newPath = __dirname + "/../client/static/images/avatars/" + req.files.imageUpload.name;
                var serverPath = "/images/avatars/" + req.files.imageUpload.name;

                if (path.existsSync(newPath)) {
                    var imgFormat = req.files.imageUpload.name.match(/([\w\d]+)(.[jpg|png|gif]+)/);

                    if (imgFormat) {
                        newPath = __dirname + "/../client/static/images/avatars/" + imgFormat[1] + '1' + imgFormat[2];
                        serverPath = "/images/avatars/" + imgFormat[1] + '1' + imgFormat[2];
                    }
                }

                fs.writeFile(newPath, data, function (err) {
                    if (err) return console.log(err);

                    var photo = {};
                    photo.url = serverPath;

                    PhotoController.create(photo, function (savedPhoto) {
                        UserController.updateProfilePhoto(registeredUser, savedPhoto);
                    });

                });
            }
        });

        next();
    });

};
