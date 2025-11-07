import multer from "multer";

const storage = multer.diskStorage({
    
    destination: function (req, file, cb) {
    },
    filename: function (req, file, cb) {
      cb(null,file.fieldname + "-" + Date.now() +"-"+ file.originalname)
    }
  })
export const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'), false);
        }
    }
})
