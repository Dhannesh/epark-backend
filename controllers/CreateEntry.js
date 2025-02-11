import { CurrentData } from "../models/CurrentData.js";
import { Parking } from "../models/Parking.js";

export const CheckAvailability = async (req, res) => {
  try {
    const availability = await Parking.find({ status: false }).limit(1);
    console.log(availability);

    if (availability) {
      res.status(200).json({
        Slotid: availability[0].slotid,
        success: true,
        data: "Slot Found",
      });
    } else {
      res.status(500).json({
        success: false,
        data: "Slot Not Found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      data: "Error While Checking Slot Availability",
      message: error.message,
    });
  }
};

export const CreateEntry = async (req, res) => {
  try {
    const { CarNumber, Contact } = req.body;
    if (!CarNumber)
      return res.status(500).json({
        success: false,
        data: "Validation required",
        message: "Car Number required",
      });
    if (!Contact)
      return res.status(500).json({
        success: false,
        data: "Validation required",
        message: "Mobile Number required",
      });
    const getSlot = await Parking.findOne({ status: false });
    console.log(getSlot);
    if (getSlot) {
      getSlot.status = true;
      await getSlot.save();
      const SlotId = parseInt(getSlot.slotid);
      console.log("slots", SlotId);
      const data = { CarNumber, Contact, SlotId };
      console.log(data);
      await CurrentData.create(data);
      res.status(200).json({
        success: true,
        data: getSlot,
        message: `Slot-${getSlot.slotid} assigned successfully for ${CarNumber}, To reach the alloted Slot No. Please Follow the same direction: ${getSlot.directions}`,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Parking is Full",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      data: "Error While Creating User Entry",
      message: error.message,
    });
  }
};
