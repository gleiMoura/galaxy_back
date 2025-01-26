import { Router } from "express";
import multer from "multer";
import { savePost, sendAllPosts, sendUserPosts } from "../controllers/postController.js";

const upload = multer({ dest: 'uploads/' });

const postsRouter = Router();
postsRouter.post("/post", upload.single('file'), savePost);
postsRouter.get("/post", sendAllPosts);
postsRouter.get("/post/user", sendUserPosts);

export default postsRouter;