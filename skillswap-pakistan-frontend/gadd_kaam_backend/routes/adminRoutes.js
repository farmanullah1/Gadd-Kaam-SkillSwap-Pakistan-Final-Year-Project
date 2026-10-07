const express = require("express");
const User = require("../models/User");
const SkillOffer = require("../models/SkillOffer");       // Marketplace
const WomenSkillOffer = require("../models/WomenSkillOffer");
 // WomenOnlyZone
const Report = require("../models/Report");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// ✅ Get all users
router.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// ✅ Delete user
router.delete("/users/:id", adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// ✅ Get all skills (Marketplace + WomenOnlyZone)
router.get("/skills", adminAuth, async (req, res) => {
  try {
    // Marketplace skills
    const marketplaceSkills = await SkillOffer.find()
      .populate("user", "username email firstName lastName profilePicture cnicFrontPicture cnicBackPicture")
      .lean();

    // Women-only skills
    const womenSkills = await WomenSkillOffer.find()
      .populate("user", "username email firstName lastName profilePicture cnicFrontPicture cnicBackPicture")
      .lean();

    // Add source field
    const marketplaceWithSource = marketplaceSkills.map((skill) => ({
      ...skill,
      source: "MarketplacePage",
    }));

    const womenWithSource = womenSkills.map((skill) => ({
      ...skill,
      source: "WomenOnlyZonePage",
    }));

    // Combine all
    const allSkills = [...marketplaceWithSource, ...womenWithSource];

    res.json(allSkills);
  } catch (err) {
    console.error("Error fetching skills:", err);
    res.status(500).send("Server error");
  }
});

// ✅ Delete skill (works for both collections)
router.delete("/skills/:id", adminAuth, async (req, res) => {
  try {
    let skill = await SkillOffer.findById(req.params.id);
    if (skill) {
      await SkillOffer.findByIdAndDelete(req.params.id);
      return res.json({ msg: "Skill deleted from Marketplace" });
    }

    skill = await WomenSkillOffer.findById(req.params.id);
    if (skill) {
      await WomenSkillOffer.findByIdAndDelete(req.params.id);
      return res.json({ msg: "Skill deleted from WomenOnlyZone" });
    }

    res.status(404).json({ msg: "Skill not found" });
  } catch (err) {
    console.error("Error deleting skill:", err);
    res.status(500).send("Server error");
  }
});

// ✅ Get all reports
router.get("/reports", adminAuth, async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("reporter", "username email")
      .populate("reportedUser", "username email")
      .populate("reportedSkill", "title");
    res.json(reports);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// ✅ Dashboard stats
router.get("/stats", adminAuth, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const skillCountMarketplace = await SkillOffer.countDocuments();
    const skillCountWomen = await WomenSkillOffer.countDocuments();
    const reportCount = await Report.countDocuments();

    res.json({
      users: userCount,
      skills: skillCountMarketplace + skillCountWomen,
      reports: reportCount,
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
