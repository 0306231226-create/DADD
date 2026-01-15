const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: 'drxtphs7g', 
    api_key: '193919359299548', 
    api_secret: 'LMSlC3bRlKMjknYfFta2t6l0ifY'
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'anh', 
        allowed_formats: ['jpg', 'png', 'jpeg'],
        public_id: (req, file) => file.fieldname + '-' + Date.now(),
    },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;