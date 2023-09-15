import Article from "../models/ArticleModel.js";
import User from "../models/UserModel.js"
import {Op} from "sequelize";

export const getArticles = async(req, res) => {
    try {
        let response;
        if(req.role === "admin"){
            response = await Article.findAll({
                attributes:['uuid','title','desc','image'],
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }else{
            response = await Article.findAll({
                attributes:['uuid','title','desc','image'],
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
                attributes:['uuid','title','desc','image'],
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
                attributes:['uuid','title','desc','image'],
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

// export const createArticle = async (req, res) => {
//     const {title, desc, image} = req.body;
//     try {
//         await Article.create({
//             title: title,
//             desc: desc,
//             image: image,
//             userId: req.userId
//         });
//         res.status(201).json({msg: "Article Created Successfuly"});
//     } catch (error) {
//         res.status(500).json({msg: error.message});
//     }
// }

export const saveArticle = (req, res)=>{
    if(req.files === null) return res.status(400).json({msg: "No File Uploaded"});
    const title = req.body.title;
    const desc = req.body.desc;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = ['.png','.jpg','.jpeg'];

    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
    if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});

    file.mv(`./public/images/${fileName}`, async(err)=>{
        if(err) return res.status(500).json({msg: err.message});
        try {
            await Product.create({title: title, desc: desc, image: fileName, url: url});
            res.status(201).json({msg: "Article Created Successfuly"});
        } catch (error) {
            console.log(error.message);
        }
    })

}

// export const updateArticle = async (req, res) => {
//     try {
//         const article = await Article.findOne({
//             where:{
//                 uuid: req.params.id
//             }
//         });
//         if(!article) return res.status(404).json({msg: "Data tidak ditemukan"});
//         const {title, desc} = req.body;
//         if(req.role === "admin"){
//             await Article.update({title, desc, image},{
//                 where:{
//                     id: article.id
//                 }
//             });
//         }else{
//             if(req.userId !== article.userId) return res.status(403).json({msg: "Akses terlarang"});
//             await Article.update({title, desc, image},{
//                 where:{
//                     [Op.and]:[{id: article.id}, {userId: req.userId}]
//                 }
//             });
//         }
//         res.status(200).json({msg: "Article updated successfuly"});
//     } catch (error) {
//         res.status(500).json({msg: error.message});
//     }
// }

export const updateArticle = async(req, res)=>{
    const article = await Article.findOne({
        where:{
            id : req.params.id
        }
    });
    if(!article) return res.status(404).json({msg: "No Data Found"});
    
    let fileName = "";
    if(req.files === null){
        fileName = article.image;
    }else{
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png','.jpg','.jpeg'];

        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});

        const filepath = `./public/images/${article.image}`;
        fs.unlinkSync(filepath);

        file.mv(`./public/images/${fileName}`, (err)=>{
            if(err) return res.status(500).json({msg: err.message});
        });
    }
    const title = req.body.title;
    const desc = req.body.desc;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    
    try {
        await Product.update({title: title,desc: desc, image: fileName, url: url},{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Article Updated Successfuly"});
    } catch (error) {
        console.log(error.message);
    }
}

// export const deleteArticle = async (req, res) => {
//     try {
//         const article = await Article.findOne({
//             where:{
//                 uuid: req.params.id
//             }
//         });
//         if(!article) return res.status(404).json({msg: "Data tidak ditemukan"});
//         const {title, desc, image} = req.body;
//         if(req.role === "admin"){
//             await Article.destroy({
//                 where:{
//                     id: article.id
//                 }
//             });
//         }else{
//             if(req.userId !== article.userId) return res.status(403).json({msg: "Akses terlarang"});
//             await Article.destroy({
//                 where:{
//                     [Op.and]:[{id: article.id}, {userId: req.userId}]
//                 }
//             });
//         }
//         res.status(200).json({msg: "Article deleted successfuly"});
//     } catch (error) {
//         res.status(500).json({msg: error.message});
//     }
// }

export const deleteArticle = async(req, res)=>{
    const article = await Article.findOne({
        where:{
            id : req.params.id
        }
    });
    if(!article) return res.status(404).json({msg: "No Data Found"});

    try {
        const filepath = `./public/images/${article.image}`;
        fs.unlinkSync(filepath);
        await Article.destroy({
            where:{
                id : req.params.id
            }
        });
        res.status(200).json({msg: "Article Deleted Successfuly"});
    } catch (error) {
        console.log(error.message);
    }
}