const secret = process.env.SECRET||""
import jwt  from 'jsonwebtoken';

export class UserService{
 async  authenticate({ ip, address }) {
        const token = jwt.sign({ acc: ip, pwd: address }, secret);
        return   token
       
}
}