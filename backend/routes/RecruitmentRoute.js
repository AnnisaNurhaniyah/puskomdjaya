import express from "express";
import {
    getRecruitments,
    getRecruitmentById,
    updateRecruitment,
    deleteRecruitment
} from "../controllers/Recruitments.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/recruitments', verifyUser, adminOnly, getRecruitments);
router.get('/recruitments/:id', verifyUser, adminOnly, getRecruitmentById);
router.patch('/recruitments/:id', verifyUser, adminOnly, updateRecruitment);
router.delete('/recruitments/:id', verifyUser, adminOnly, deleteRecruitment);

export default router;