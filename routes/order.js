const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndStaff,
  verifyTokenAndAdmin,
} = require("../utils/verifyToken");
const logger = require("../utils/logger");

const router = require("express").Router();

//Create an Order
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);

  // const data = req?.body?.data;
  // const savedOrder = await newOrder.save();
  // console.log(savedOrder);

  try {
    const savedOrder = await newOrder.save();
    console.log("Order Made Successfully");
    res.status(200).json(savedOrder);

    // // START SENDING EMAIL
    // const msg = {
    //   to: req.body.email,
    //   from: "joe.ebh100@live.com", // Use the email address or domain you verified above
    //   templateId: "d-062c0c43ea0e402fa9965e0400df2fc1",
    //   dynamicTemplateData: {
    //     name: req.body.firstname + " " + req.body.lastname,
    //   },
    // };

    // //ES6
    // sgMail.send(msg).then(
    //   () => {
    //     console.log("Message sent!");
    //   },
    //   (error) => {
    //     console.error(error);

    //     if (error.response) {
    //       console.error(error.response.body);
    //     }
    //   }
    // );

    // //ES8
    // (async () => {
    //   try {
    //     await sgMail.send(msg);
    //   } catch (error) {
    //     console.error(error);

    //     if (error.response) {
    //       console.error(error.response.body);
    //     }
    //   }
    // })();
  } catch (err) {
    res.status(500).json(err);
  }
});

//Edit Order
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json(err);
  }
});

//Delete Order
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been Deleted!!!");
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get User Orders
router.get("/find/:userId", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get All
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    //Add category for filtering orders
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ANNUAL INCOME

//GET MONTHLY INCOME
router.get("/monthly/income", verifyTokenAndAdmin, async (req, res) => {
  const productId = req.query.pid;
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
          ...(productId && {
            products: { $elemMatch: { productId } },
          }),
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET WEEKLY INCOME

//GET DAILY INCOME

module.exports = router;
