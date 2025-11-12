import jwt from 'jsonwebtoken';
export const requireAuth = (req,res,next)=>{
  const header = req.headers.authorization;
  if(!header) return res.status(401).json({ error: 'No auth header' });
  const token = header.split(' ')[1];
  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    next();
  }catch(e){ return res.status(401).json({ error: 'Invalid token' }); }
};
