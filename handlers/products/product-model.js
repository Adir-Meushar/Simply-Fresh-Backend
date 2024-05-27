const mongoose = require('mongoose');
const moment = require('moment');

const imgSchema = new mongoose.Schema({
    url: String,
    alt: String
});

const nutritionalValueSchema = new mongoose.Schema({
    calories: { type: Number, required: true },
    carbohydrates: { type: Number, required: true },
    protein: { type: Number, required: true },
    fat: { type: Number, required: true }
});

const productSchema = new mongoose.Schema({
    category: { type: String, required: true },
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    finalPrice: {
        type: Number,
        default: function () {
            return Math.floor(parseFloat((this.price * 0.8).toFixed(2)));
        }
    },
    sale: { type: Boolean, default: false },
    nutritionalValue: nutritionalValueSchema,
    img: imgSchema,
    favorite: { type: Array },
    unit: { type: String, enum: ['kg', 'package', 'unit'], default: 'kg' },
    createdTime: { type: String, default: () => moment().format('D-M-Y HH:mm:ss') }
});

// Pre-save hook to update finalPrice based on the current price
productSchema.pre('save', function (next) {
    this.finalPrice = Math.floor(parseFloat((this.price * 0.8).toFixed(2)));
    next();
});

exports.Product = mongoose.model('products', productSchema);
