import mongoose, { Schema, Document } from 'mongoose';

export interface TrustedContact {
  name: string;
  phone: string;
  email?: string;
  relation?: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone: string;
  trustedContacts: TrustedContact[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false }, // Select false to not return password by default
    phone: { type: String, required: true },
    trustedContacts: [
      {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String },
        relation: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// Prevent overwriting model if already compiled
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
