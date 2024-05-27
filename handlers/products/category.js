const { Product } = require("./product-model");

module.exports=app=>{ 

    //Get All Products||Permissions:All//
    app.get('/products/all',async(req,res)=>{
        try{

            const products=await Product.find();

            res.status(200).send(products);

        }catch(error){
            res.status(500).send({ error: 'Error fetching products'});
        }
    })

     //Get All ProductsOnSale||Permissions:All//
     app.get('/products/sale',async(req,res)=>{
        try{

            const productsOnSale = await Product.find({ sale: 'true' });

            res.send(productsOnSale);
            
        }catch(error){
            res.status(500).send({ error: 'Error fetching products'});
        }
    })

    //Get All Vegetables||Permissions:All//
    app.get('/products/vegetables',async(req,res)=>{
        try{

            const vegetables = await Product.find({ category: 'Vegetables' });

            res.send(vegetables);

        }catch(error){
            res.status(500).send({ error: 'Error fetching products'});
        }
    })

    //Get All Fruits||Permissions:All//
    app.get('/products/fruits',async(req,res)=>{
        try{

            const fruits = await Product.find({ category: 'Fruits' });

            res.send(fruits);

        }catch(error){
            res.status(500).send({ error: 'Error fetching products'});
        }
    });

    //Get All Fruits||Permissions:All//
    app.get('/products/bakery',async(req,res)=>{ 
        try{
            
            const bakery = await Product.find({ category: 'Bakery' });

            res.send(bakery);

        }catch(error){
            res.status(500).send({ error: 'Error fetching products'});
        } 
    });

      //Get All Dairy&Eggs||Permissions:All//
      app.get('/products/dairy&eggs',async(req,res)=>{
        try{

            const dairyAndeggs = await Product.find({ category: 'Dairy&Eggs' });

            res.send(dairyAndeggs);
            
        }catch(error){
            res.status(500).send({ error: 'Error fetching products'});
        }
    });
    
}