
import express from 'express';
import "dotenv/config";
import connectDB from './src/configs/db.config.js';
import cors from 'cors';
import userRoutes from './src/routes/user.routes.js';

const app = express();

const port = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
  origin: "https://my-blog-project-mu-two.vercel.app",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}));

// Middleware
app.use(express.json());

app.use(express.static("public"));
app.use("/public", express.static("public"));

// API Routes
app.use("/api/user", userRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('API Blogs Backend is running successfully!');
});

// Database connection and server start
async function startServer() {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

startServer();
