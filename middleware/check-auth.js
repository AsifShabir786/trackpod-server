const jwt=require('jsonwebtoken');
module.exports=(req,res,next)=>{
  try {
    const token=req.headers.authorization.split(" ")[1];
    console.log("token",token)
    const verify=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    console.log(verify)
    if(verify.user.id){
        next()
    }else{
        return res.status(401).json({
          msg:"invalid token"
        })
    }
   
  } catch (error) {
    return res.status(401).json({
        msg:"invalid token"
    })
    
  }
}