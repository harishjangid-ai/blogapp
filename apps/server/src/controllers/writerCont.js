import Writer from '../models/writerModel.js'

export const writers = async(req, res)=>{
    try {
        const writer = await Writer.find();

        return res.json(writer);
    } catch (error) {
        return res.json({success: false, error})
    }
}