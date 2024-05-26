import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
    {
        teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
        quizName: { type: String, required: true },
        description: { type: String, required: true },
        switchclick:{type:Boolean},
        createdAt: { type: String},
        numberofQuestions: { type: Number, default:0},
        questions: { type: Array, default: [] }
    },
    { collection: 'quiz-data' }
);

quizSchema.pre('save', function (next) {
    if (!this.createdAt) {
        const currentDate = new Date();
        // Format date as yyyy-mm-dd
        const formattedDate = currentDate.toISOString().split('T')[0];
        // Get Indian Standard Time (IST) offset
        const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
        const istTime = new Date(currentDate.getTime() + istOffset);
        const formattedTime = istTime.toTimeString().split(' ')[0];

        this.createdAt = `${formattedDate} ${formattedTime} IST`;
    }
    next();
});

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
