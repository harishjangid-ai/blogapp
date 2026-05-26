import Request from "../models/writersReqModel.js";
import User from "../models/userModel.js";
import Writer from "../models/writerModel.js";
export const newWriter = async (req, res) => {
  try {
    const { dateOfBirth, email, contentType, profession, description } =
      req.body;
    const userId = req.user.userId;

    if (
      !userId ||
      !dateOfBirth ||
      !email ||
      !contentType ||
      !profession ||
      !description
    ) {
      return res.json({ success: false, error: "All fields are required" });
    }

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.json({ success: false, error: "User not found" });
    }

    const emailExist = await Request.findOne({ email });
    if (emailExist) {
      return res.json({
        success: false,
        error: "Email is already used by another user",
      });
    }

    await Request.create({
      userId,
      dateOfBirth,
      email,
      contentType,
      profession,
      description,
      reqStatus: "pending",
      fullName: user.fullName,
      phone: user.phone,
    });

    return res.json({ success: true, message: "Request submitted succefully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error });
  }
};

export const requests = async (req, res) => {
  try {
    const req = await Request.find();
    return res.json(req);
  } catch (error) {
    return res.json({ success: false, error });
  }
};

export const pendingRequests = async (req, res) => {
  try {
    const req = await Request.find({$or: [{ reqStatus: "pending" }]});
    return res.json(req);
  } catch (error) {
    return res.json({ success: false, error });
  }
};
export const approvedRequests = async (req, res) => {
  try {
    const req = await Request.find({$or: [{ reqStatus: "approved" }]});
    return res.json(req);
  } catch (error) {
    return res.json({ success: false, error });
  }
};
export const rejectedRequests = async (req, res) => {
  try {
    const req = await Request.find({$or: [{ reqStatus: "rejected" }]});
    return res.json(req);
  } catch (error) {
    return res.json({ success: false, error });
  }
};

export const reqUpdate = async (req, res) => {
  try {
    const { status, userId, role, reqId } = req.body;
    if (!status || !userId || !reqId || !role) {
      return res.json({ success: false, error: "Failed" });
    }
    const user = await User.findByIdAndUpdate(userId, { role });

    const request = await Request.findByIdAndUpdate(reqId, {
      reqStatus: status,
    });

    if (!user || !request) {
      return res.json({ success: false, error: "Failed" });
    }

    if (status == "approved") {
      await Writer.create({
        userId,
        fullName: user.fullName,
        phone: user.phone,
        email: request.email,
        contentType: request.contentType,
        profession: request.profession,
        dateOfBirth: request.dateOfBirth,
        description: request.description,
      });
    }

    return res.json({
      success: true,
      message: "Now User this become writer",
      user,
    });
  } catch (error) {
    console.log(error);
  }
};


export const checkRequest = async(req, res)=>{
  try {
    const userId = req.user.userId;
    const checkReq = await Request.findOne({userId, reqStatus: "pending"});
    if(!checkReq){
      return res.json({success: false, message: "Request is not submitted"});
    }

    return res.json(checkReq);
  } catch (error) {
    console.log(error);
    return res.json({success: false, error})
  }
}