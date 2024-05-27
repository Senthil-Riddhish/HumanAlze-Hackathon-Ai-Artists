// models/Student.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  regno: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

studentSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const student = mongoose.model('student', studentSchema);
export default student;
