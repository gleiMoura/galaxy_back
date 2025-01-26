import { Request, Response } from "express";
import { PostType } from "../interfaces/index.js";
import { generateProfileLink } from "../repository/filesRepository.js";
import { createPost, getAllPosts, getUserPosts } from "../services/postService.js";

export const savePost = async (req: Request, res: Response) => {
    const file = req.file;
    const caption: string = req.body.caption;
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];

    const postImageLink = await generateProfileLink(file);

    const createdPost: PostType = await createPost(caption, token, postImageLink);

    res.send(createdPost).status(201);
};

export const sendAllPosts = async (req: Request, res: Response) => {
    const allPosts = await getAllPosts();

    res.send(allPosts).status(201);
};

export const sendUserPosts = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];

    const userPosts = await getUserPosts(token);

    res.send(userPosts).status(201);
};