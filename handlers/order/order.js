const guard = require('../helpers/guard');
const { getUserInfo } = require('../helpers/jwtUtils');
const { Product } = require('../products/product-model');
const Order = require('./order-model');

module.exports = app => {
    //Create new order||Permissions:Registerd user//
    app.post('/orders/create', guard, async (req, res) => {
        try {

            const userToken = getUserInfo(req, res);

            if (!userToken) {
                return res.status(401).send({
                    error: { 
                        code: 401,
                        message: 'Unauthorized',
                        details: 'User authentication failed.',
                    },
                });
            }

            const { cart, deliveryDate } = req.body;

            if (!Array.isArray(cart) || cart.length === 0) {
                return res.status(400).send({ error: 'Cart is empty or invalid' });
            }

            const items = [];

            for (const item of cart) {
                const { id, quantity } = item;
                const product = await Product.findById(id);

                if (!product) {
                    return res.status(404).send({ error: `Product with ID ${id} not found` });
                }

                items.push({
                    product: id,
                    productName: product.title,
                    quantity: quantity,
                    price: product.price,
                    finalPrice: product.finalPrice,
                    sale: product.sale,
                    unit: product.unit
                });
            }

            // Calculate total price
            const totalPricePromise = Promise.all(items.map(async (item) => {
                const product = await Product.findById(item.product);
                return product.sale ? product.finalPrice * item.quantity : product.price * item.quantity;
            }));

            const totalPriceArray = await totalPricePromise;
            const totalPrice = totalPriceArray.reduce((acc, price) => acc + price, 0);

            if(!deliveryDate){
                return res.status(400).send({ error: 'Delivery Date is required' });
            }

            const order = new Order({
                user: userToken.userId,
                items: items,
                totalPrice: totalPrice,
                deliveryDate
            });

            await order.save();
            res.status(200).send(order);

        } catch (error) {
            console.error(error);
            res.status(500).send({ error: 'Error creating order' });
        }
    });

   //Get my Orders||Permissions:Registerd user//
    app.get('/orders/my-orders/:userId', guard, async (req, res) => {
        try {

            const userToken = getUserInfo(req, res);

            if (userToken.userId !== req.params.userId) {
                return res.status(401).send({
                    error: {
                        code: 401,
                        message: 'Unauthorized',
                        details: 'User authentication failed.',
                    },
                });
            }

            const myOrders = await Order.find({ user: req.params.userId });
            
            if (!myOrders) {
                return res.status(404).send({
                    error: {
                        code: 404,
                        message: 'Not Found',
                        details: 'No orders found for the user.',
                    },
                });
            }

                res.status(200).send(myOrders);

        } catch (error) {
            console.error(error);
            res.status(500).send({ error: 'Error fetching user orders' });
        }
    });

    //Delete order||Permissions:Registerd user//
    app.delete('/orders/delete/:orderId', guard, async (req, res) => {
        try {

            const order = await Order.findByIdAndDelete( req.params.orderId );

            if (!order) {
                return res.status(404).send({
                    error: {
                        code: 404,
                        message: 'Not Found',
                        details: 'Order was not found.',
                    },
                });
            }

            const userToken = getUserInfo(req, res);

            if (userToken.userId !== order.user.toString()) {
                return res.status(401).send({
                    error: {
                        code: 401,
                        message: 'Unauthorized',
                        details: 'User authentication failed.',
                    },
                });
            }

                res.status(200).send({
                    orderDeleted:order,
                    message:'Order Deleted Successfully'
                })
                
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: 'Error deleting order' });
        }
    });
    
}
