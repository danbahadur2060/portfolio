import jwt from "jsonwebtoken"
export const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").split(" ")[1];
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Please login to continue",
            })
        }
        const decoded = await jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid token",   
            error: error.message,
        });
    }
}

export const isAdmin = async (req, res, next) => {
        try {
            if(req.user.role !== "admin"){
                return res.status(401).json({
                    success: false,
                    message: "You are not authorized to access this resource",
                })
            }
            if(req.user.role !== "user"){
                return res.status(401).json({
                    success: false,
                    message: "You are not authorized to access this resource",
                })
            }
            next();
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }
}