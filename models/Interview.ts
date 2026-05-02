import mongoose from 'mongoose';

export interface IInterview extends mongoose.Document {
  userId?: string;
  skill: string;
  question: string;
  answer: string;
  score: number;
  critique: string;
  perfectAnswer: string;
  createdAt: Date;
}

const InterviewSchema = new mongoose.Schema<IInterview>({
  userId: { type: String, required: false },
  skill: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  score: { type: Number, required: true },
  critique: { type: String, required: true },
  perfectAnswer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Interview || mongoose.model<IInterview>('Interview', InterviewSchema);
