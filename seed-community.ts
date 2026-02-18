const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Manually load .env.local
try {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach((line: string) => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        if (key && value) {
          process.env[key] = value;
        }
      }
    });
  }
} catch (e) {
  console.log("Could not load .env.local");
}

const { Schema } = mongoose;

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/safeher";

// Define schemas inline to avoid import issues in seed script
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false },
  phone: { type: String, required: true },
  trustedContacts: []
}, { timestamps: true });

const PostSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  content: { type: String, required: true },
  location: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  type: {
    type: String,
    enum: ['Harassment', 'Theft', 'Suspicious', 'Unsafe Area', 'Lighting'],
    default: 'Unsafe Area'
  },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  severity: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

// Mock Data
const REPORTS = [
  {
    type: "Harassment",
    content: "Verbal harassment near the transit stop on Elm Street. Group of individuals making threatening remarks to passersby.",
    location: "Connaught Place, Delhi",
    lat: 28.6315,
    lng: 77.2167,
    likes: 12,
    verified: true,
    severity: "high",
  },
  {
    type: "Unsafe Area",
    content: "Poor street lighting on the stretch between Oak Park and Main Square. Multiple residents have reported feeling unsafe.",
    location: "Hauz Khas, Delhi",
    lat: 28.5494,
    lng: 77.2001,
    likes: 28,
    verified: true,
    severity: "medium",
  },
  {
    type: "Suspicious",
    content: "Unmarked van parked near the playground for several hours. No one seen entering or leaving.",
    location: "Karol Bagh, Delhi",
    lat: 28.6519,
    lng: 77.1909,
    likes: 7,
    verified: false,
    severity: "medium",
  },
  {
    type: "Theft",
    content: "Phone snatching incident while walking. The individual fled on a bicycle heading south.",
    location: "Lajpat Nagar, Delhi",
    lat: 28.5677,
    lng: 77.2432,
    likes: 15,
    verified: true,
    severity: "high",
  },
  {
    type: "Lighting",
    content: "Three consecutive street lights are out near the community center. Area is extremely dark after 7 PM.",
    location: "Dwarka, Delhi",
    lat: 28.5921,
    lng: 77.0460,
    likes: 34,
    verified: true,
    severity: "low",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing posts
    await Post.deleteMany({});
    console.log("Cleared existing posts");

    // Create a dummy user if none exists
    let user = await User.findOne({ email: "admin@safeher.com" });
    if (!user) {
      user = await User.create({
        name: "Community Admin",
        email: "admin@safeher.com",
        password: "password123",
        phone: "1234567890",
        trustedContacts: []
      });
      console.log("Created admin user");
    }

    // Seed reports
    for (const report of REPORTS) {
      await Post.create({
        ...report,
        user: user._id,
        userName: user.name,
        comments: Math.floor(Math.random() * 5)
      });
    }

    console.log(`Seeded ${REPORTS.length} reports successfully`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}


seed();

export { };
