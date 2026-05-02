import mongoose from 'mongoose';

export interface IStrategy extends mongoose.Document {
  userId: string;
  title: string;
  skillGap: { skill: string; current: string; required: string; gap: number }[];
  radarData: { skill: string; current: number; required: number }[];
  mermaidDiagram: string;
  roadmap: { milestone: string; duration: string; details: string[] }[];
  cloudStack: { service: string; role: string; useCase: string }[];
  isActive: boolean;
  createdAt: Date;
}

const StrategySchema = new mongoose.Schema<IStrategy>({
  userId: { type: String, required: true },
  title: { type: String, default: 'Career Strategy' },
  isActive: { type: Boolean, default: false },
  skillGap: [{
    skill: String,
    current: String,
    required: String,
    gap: Number
  }],
  radarData: [{
    skill: String,
    current: Number,
    required: Number
  }],
  mermaidDiagram: String,
  roadmap: [{
    milestone: String,
    duration: String,
    details: [String]
  }],
  cloudStack: [{
    service: String,
    role: String,
    useCase: String
  }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Strategy || mongoose.model<IStrategy>('Strategy', StrategySchema);
