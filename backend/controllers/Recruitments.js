import Recruitment from "../models/RecruitmentModel.js";

export const getRecruitments = async(req, res) => {
    try {
        const response = await Recruitment.findAll({
            attributes:['uuid','position','cv','status','role']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getRecruitmentById = async (req, res) => {
    try {
        const response = await Recruitment.findOne({
            attributes:['uuid','position','cv','status','role'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateRecruitment = async (req, res) => {
    const recruitment = await Recruitment.findOne({
        where:{
            uuid: req.params.id
        }
    });
    if(!recruitment) return res.status(404).json({msg: "Data tidak ditemukan"});
    const {status} = req.body;
    try {
        await Recruitment.update({
            status: status
        },{
            where:{
                id: recruitment.id
            }
        });
        res.status(200).json({msg: "Recruitment updated successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const deleteRecruitment = async (req, res) => {
    const recruitment = await Recruitment.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!recruitment) return res.status(404).json({msg: "Data tidak ditemukan"});
    try {
        await Recruitment.destroy({
            where:{
                id: recruitment.id
            }
        });
        res.status(200).json({msg: "Recruitment Deleted"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}