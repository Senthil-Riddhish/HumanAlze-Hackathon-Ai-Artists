import mongoose from 'mongoose';

const QuizStudentSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
        unique: true
    },
    studentRegnArray: {
        type: [{
            regn: String,
            status: {
                type: Boolean,
                default: false
            }
        }],
        default: []
    }
});

const QuizStudent = mongoose.model('QuizStudent', QuizStudentSchema);
export default QuizStudent;
