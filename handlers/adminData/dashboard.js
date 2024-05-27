const guard=require('../helpers/guard');
const { Product } = require('../products/product-model');

module.exports=app=>{
    app.get('/dashboard/products/data', guard, async (req, res) => {
        try {

            const totalAmount = await Product.find().countDocuments();

            const totalAmountOnSale=await Product.countDocuments({ sale: 'true' });

            const vegetablesAmount = await Product.countDocuments({ category: 'Vegetables' });

            const fruitsAmount = await Product.countDocuments({ category: 'Fruits' });

            const bakeryAmount = await Product.countDocuments({ category: 'Bakery' });

            const dairyAndEggsAmount = await Product.countDocuments({ category: 'Dairy&Eggs' });
    
            const categoryPrices = await Product.aggregate([
                { $group: { _id: "$category", highestPrice: { $max: "$price" }, lowestPrice: { $min: "$price" } } }
            ]);

            const productsOnSaleByCategory = await Product.aggregate([
                { $match: { sale: true } }, // Match documents where sale is true
                { $group: { _id: "$category", count: { $sum: 1 } } } // Group by category and count the number of documents
            ]);
    
            const productsOnSale = productsOnSaleByCategory.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, {});
            
            res.json({ totalAmount,totalAmountOnSale, vegetablesAmount, fruitsAmount,
                     bakeryAmount, dairyAndEggsAmount, categoryPrices, productsOnSale });
                     
        } catch (error) {
            console.error("Error fetching product amounts:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });
}