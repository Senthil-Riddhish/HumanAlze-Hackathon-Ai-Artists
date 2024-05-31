import mongoose from 'mongoose';

const StudentQuizStatusSchema = new mongoose.Schema({
    studentRegn: {
        type: String,
        required: true,
        unique: true
    },
    incompleteQuizList: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Quiz',
        default: []
    },
    completedQuizList: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Quiz',
        default: []
    },
    quizAnswer: {
        type: Array,
        default: []
    }
});

const StudentQuizStatus = mongoose.model('StudentQuizStatus', StudentQuizStatusSchema);
export default StudentQuizStatus;
