export function role(roles=[]){
    return (req, res, next)=>{
        const userRole = req.user.role;
        if(!roles.includes(userRole)){
            return res.json({success: false, error: "Unauthorized"})
        };
        next();
    }
};
