const mongoose = require('mongoose');
const moment = require('moment');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        productName: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        price: Number,
        finalPrice: Number,
        sale: Boolean,
        unit: String,
    }],
    totalPrice: { type: Number, required: true, set: v => Math.floor(v) },
    deliveryDate: { type: String, default: () => moment().format('DD-MM-YYYY') },
    createdTime: { type: String, default: () => moment().format('DD-MM-YYYY HH:mm:ss') }
});

orderSchema.pre('save', function(next) {
    // Remove timezone information from deliveryDate
    this.deliveryDate = moment(this.deliveryDate).format('DD-MM-YYYY');
    next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
