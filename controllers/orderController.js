import Order from "../models/order.js";
import Product from "../models/Product.js";
import { isAdmin } from "./userController.js";

export async function createOrder(req, res) {
    console.log(req.body)
	//ORD000001
    if(req.user == null){
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }
	try {
		const latestOrder = await Order.findOne().sort({ date: -1 });

		let orderId = "ORD000001";

		if (latestOrder != null) {
			let latestOrderId = latestOrder.orderId; // "ORD000012"
			let latestOrderNumberString = latestOrderId.replace("ORD", ""); // "000012"
			let latestOrderNumber = parseInt(latestOrderNumberString); // 12

			let newOrderNumber = latestOrderNumber + 1; // 13
			let newOrderNumberString = newOrderNumber.toString().padStart(6, "0"); // "000013"

			orderId = "ORD" + newOrderNumberString; // "ORD000013"
		}

        const items = []
        let total = 0



        for(let i = 0; i < req.body.items.length; i++){

            const product = await Product.findOne({productID : req.body.items[i].productID})

            if(product == null){
                return res.status(400).json({
                    message : `Product with ID ${req.body.items[i].productID} not found`
                })
            }
            
            //check if stock is available
            // if(product.stock < req.body.items[i].quantity){
            //     return res.status(400).json({
            //         message : `Only ${product.stock} items available for product ID ${req.body.items[i].productID}`
            //     })
            // }

            items.push({
                productID : product.productID,
                name : product.name,
                price : product.price,
                quantity : req.body.items[i].quantity,
                image : product.images[0]
            })

            total += product.price * req.body.items[i].quantity
        }

        let name = req.body.name
        if(name == null){
            name = req.user.firstName + " " + req.user.lastName
        }

        const newOrder = new Order({
            orderId : orderId,
            email : req.user.email,
            name : name,
            address : req.body.address,
            total : total,
            items : items,
            phone : req.body.phone,
        })

        await newOrder.save()

        // for (let i = 0; i < items.length; i++){
        //     await Product.updateOne(
        //         { productID : items[i].productID },
        //         { $inc : { stock : -items[i].quantity } }
        //     )
        // }

        return res.json({
            message : "Order placed successfully",
            orderId : orderId
        })

	} catch (error) {
		return res.status(500).json({
			message: "Error Placing order",
			error: error.message,
		});
	}
}

export async  function getOrders(req, res){
    if(req.user == null){
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    if(isAdmin(req)){
        const orders = await Order.find().sort({date : -1})

        res.json(orders)

    }else{

        const orders = await Order.find({email : req.user.email}).sort({date : -1})

        res.json(orders)

    }
}
