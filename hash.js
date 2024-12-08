import bcrypt from 'bcryptjs';
import { User } from './server/models/index.js'; // Adjust the path to your User model  

const rehashPassword = async () => {  
  const username = 'superadmin'; // Replace with the username you want to rehash  
  const plainTextPassword = 'admin123'; // Replace with the correct plain-text password  

  const user = await User.findOne({ where: { username } });  
  if (!user) {  
    console.error('User not found');  
    return;  
  }  

  const hashedPassword = await bcrypt.hash(plainTextPassword, 10);  
  user.password = hashedPassword;  
  await user.save();  

  console.log(`Password for user ${username} has been rehashed.`);  
};  

rehashPassword().catch((err) => {  
  console.error('Error rehashing password:', err);  
});  