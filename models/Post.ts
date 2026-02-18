import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  user: mongoose.Types.ObjectId;
  userName: string; // Denormalized for easier display
  content: string;
  location: string;
  type: 'alert' | 'update' | 'question';
  likes: number;
  comments: number;
  createdAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    content: { type: String, required: true },
    location: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['alert', 'update', 'question'], 
      default: 'update' 
    },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
