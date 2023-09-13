import Article from "../models/ArticleModel.js";
import User from "../models/UserModel.js"
import {Op} from "sequelize";

export const getArticles = async(req, res) => {
    try {
        let response;
        if(req.role === "admin"){
            response = await Article.findAll({
                attributes:['uuid','title','desc'],
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }else{
            response = await Article.findAll({
                attributes:['uuid','title','desc'],
                where:{
                    userId: req.userId
                },
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getArticleById = async (req, res) => {
    try {
        const article = await Article.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!article) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        if(req.role === "admin"){
            response = await Article.findOne({
                attributes:['uuid','title','desc'],
                where:{
                    id: article.id
                },
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }else{
            response = await Article.findOne({
                attributes:['uuid','title','desc'],
                where:{
                    [Op.and]:[{id: article.id}, {userId: req.userId}]
                },
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createArticle = async (req, res) => {
    const {title, desc} = req.body;
    try {
        await Article.create({
            title: title,
            desc: desc,
            userId: req.userId
        });
        res.status(201).json({msg: "Article Created Successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateArticle = async (req, res) => {
    try {
        const article = await Article.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!article) return res.status(404).json({msg: "Data tidak ditemukan"});
        const {title, desc} = req.body;
        if(req.role === "admin"){
            await Article.update({title, desc},{
                where:{
                    id: article.id
                }
            });
        }else{
            if(req.userId !== article.userId) return res.status(403).json({msg: "Akses terlarang"});
            await Article.update({title, desc},{
                where:{
                    [Op.and]:[{id: article.id}, {userId: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "Article updated successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!article) return res.status(404).json({msg: "Data tidak ditemukan"});
        const {title, desc} = req.body;
        if(req.role === "admin"){
            await Article.destroy({
                where:{
                    id: article.id
                }
            });
        }else{
            if(req.userId !== article.userId) return res.status(403).json({msg: "Akses terlarang"});
            await Article.destroy({
                where:{
                    [Op.and]:[{id: article.id}, {userId: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "Article deleted successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}