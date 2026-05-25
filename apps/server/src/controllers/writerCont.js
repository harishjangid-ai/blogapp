import Writer from '../models/writerModel.js'

export const writers = async(req, res)=>{
    try {
        const writer = await Writer.find();

        return res.json(writer);
    } catch (error) {
        return res.json({success: false, error})
    }
}

export const selectedWriter = async(req, res)=>{
    try {
        const { id } = req.body;

        const writer = await Writer.findOne({ _id: id });

        return res.json(writer);
    } catch (error) {
        console.log(error)
        return res.json({success: false, error})
    }
}