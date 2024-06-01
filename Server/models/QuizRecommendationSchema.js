import mongoose from "mongoose";

const { Schema } = mongoose;

const RecommendationSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const QuizRecommendationSchema = new Schema({
  quizId: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
    unique: true
  },
  good: [RecommendationSchema],
  average: [RecommendationSchema],
  bad: [RecommendationSchema]
});

const QuizRecommendation = mongoose.model('QuizRecommendation', QuizRecommendationSchema);
export default QuizRecommendation;
