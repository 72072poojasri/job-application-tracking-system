console.log("🚀 ATS BACKEND STARTING");

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

/* =====================
   DB CONNECTION
===================== */
mongoose
  .connect("mongodb://127.0.0.1:27017/ats_db")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

/* =====================
   MODELS
===================== */
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["candidate", "recruiter", "hiring_manager"],
      default: "candidate"
    }
  })
);

const Company = mongoose.model(
  "Company",
  new mongoose.Schema({
    name: String,
    description: String
  }, { timestamps: true })
);

const Job = mongoose.model(
  "Job",
  new mongoose.Schema({
    title: String,
    description: String,
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, default: "open" }
  }, { timestamps: true })
);

const Application = mongoose.model(
  "Application",
  new mongoose.Schema({
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    stage: { type: String, default: "Applied" }
  }, { timestamps: true })
);

const ApplicationHistory = mongoose.model(
  "ApplicationHistory",
  new mongoose.Schema({
    application: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
    fromStage: String,
    toStage: String,
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  }, { timestamps: true })
);

/* =====================
   AUTH MIDDLEWARE
===================== */
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.user = await User.findById(decoded.id);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

/* =====================
   ASYNC EMAIL MOCK
===================== */
const sendEmailAsync = (to, subject) => {
  setTimeout(() => {
    console.log(`📧 Email sent to ${to}: ${subject}`);
  }, 1000);
};

/* =====================
   AUTH ROUTES
===================== */
app.post("/api/auth/register", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({ ...req.body, password: hashed });
  res.json({ message: "USER REGISTERED", user });
});

app.post("/api/auth/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const ok = await bcrypt.compare(req.body.password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, role: user.role }, "secretkey");
  res.json({ token });
});

/* =====================
   COMPANY ROUTE
===================== */
app.post("/api/companies", protect, restrictTo("recruiter"), async (req, res) => {
  const company = await Company.create(req.body);
  res.json(company);
});

/* =====================
   JOB ROUTES
===================== */
app.post("/api/jobs", protect, restrictTo("recruiter"), async (req, res) => {
  const job = await Job.create({
    ...req.body,
    createdBy: req.user._id
  });
  res.json(job);
});

app.get("/api/jobs", protect, async (req, res) => {
  const jobs = await Job.find().populate("company", "name");
  res.json(jobs);
});

/* =====================
   APPLICATION ROUTES
===================== */
app.post("/api/applications/:jobId", protect, restrictTo("candidate"), async (req, res) => {
  const appn = await Application.create({
    job: req.params.jobId,
    candidate: req.user._id
  });

  sendEmailAsync(req.user.email, "Application Submitted");
  res.json(appn);
});

const workflow = ["Applied", "Screening", "Interview", "Offer", "Hired"];

app.patch(
  "/api/applications/:id/stage",
  protect,
  restrictTo("recruiter"),
  async (req, res) => {
    const appn = await Application.findById(req.params.id);
    const { stage } = req.body;

    if (stage !== "Rejected") {
      const curr = workflow.indexOf(appn.stage);
      const next = workflow.indexOf(stage);
      if (next !== curr + 1) {
        return res.status(400).json({ message: "Invalid transition" });
      }
    }

    await ApplicationHistory.create({
      application: appn._id,
      fromStage: appn.stage,
      toStage: stage,
      changedBy: req.user._id
    });

    appn.stage = stage;
    await appn.save();

    sendEmailAsync("candidate@email.com", `Stage moved to ${stage}`);
    res.json(appn);
  }
);

app.get(
  "/api/applications/job/:jobId",
  protect,
  restrictTo("recruiter"),
  async (req, res) => {
    const filter = { job: req.params.jobId };
    if (req.query.stage) filter.stage = req.query.stage;

    const apps = await Application.find(filter)
      .populate("candidate", "name email");

    res.json(apps);
  }
);

app.get(
  "/api/my-applications",
  protect,
  restrictTo("candidate"),
  async (req, res) => {
    const apps = await Application.find({ candidate: req.user._id })
      .populate("job", "title");
    res.json(apps);
  }
);

/* =====================
   ROOT
===================== */
app.get("/", (req, res) => {
  res.send("ATS Backend Running");
});

/* =====================
   SERVER
===================== */
app.listen(3001, () => {
  console.log("🚀 ATS SERVER RUNNING ON 3001");
});
