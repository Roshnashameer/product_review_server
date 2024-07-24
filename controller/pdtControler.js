const products = require("../models/productModel")

exports.getAllProducts = async (req, res) => {
    try {
        const allProducts = await products.find()
        res.status(200).json(allProducts)
    }
    catch (err) {
        res.status(401).json(err)
    }
}
exports.getProduct = async (req, res) => {
    const { id } = req.params;
    
    try {
        const productData = await products.findOne({ _id:id });
        
        res.status(200).json(productData)
    }
    catch (err) {
        res.status(401).json(err)
    }
}
exports.rateProduct = async (req, res) => {
    
    
    try {
        const { rating } = req.body;
        const product = await products.findById(req.params.id);
        
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.rating.count += 1;
        product.rating.rate = (product.rating.rate * (product.rating.count - 1) + rating) / product.rating.count;

        await product.save();
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};