import { Router } from "express";
import InventoryModel from "../models/inventorySchema.js";

const inventoryRouter = Router();

// Post API
inventoryRouter.post("/", async (req, res) => {
  try {
    const { name, quantity, image } = req.body;

    const inventoryItem = new InventoryModel({
      name: name,
      image: image,
      quantity: quantity,
    });

    await inventoryItem.save();
    return res.json();
  } catch (error) {
    console.log(error);
    return res.send("Unknown error occured!!!");
  }
});

// Get API
inventoryRouter.get("/", async (_req, res) => {
  try {
    const items = await InventoryModel.find({});

    return res.json(items);
  } catch (error) {
    console.log(error);
    return res.send("Unknown error occured!!!");
  }
});

// Update API
inventoryRouter.put("/:id", async (req, res) => {
  try {
    const itemId = req.params.id;

    const item = await InventoryModel.findByIdAndUpdate(itemId, req.body);

    await item.save();

    return res.send("Item updated succesfully.");
  } catch (error) {
    console.log(error);
    return res.send("Unknown error occured!!!");
  }
});

// Delete API
inventoryRouter.delete("/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    await InventoryModel.findByIdAndDelete(itemId);

    return res.send("Item deleted successfully.");
  } catch (error) {
    console.log(error);
    return res.send("Unknown error occured!!!");
  }
});

export default inventoryRouter;
