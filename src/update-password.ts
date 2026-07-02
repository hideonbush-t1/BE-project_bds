
import * as bcrypt from 'bcrypt';

async function generateHash() {
  const password = '123456';
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  
  console.log('--------------------------------------------------');
  console.log('Mật khẩu:', password);
  console.log('Chuỗi Hash chuẩn để lưu vào Database:');
  console.log(hash);
  console.log('--------------------------------------------------');
}

generateHash();