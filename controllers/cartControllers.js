
const Cart = require('../models/Cart');
const Item = require('../models/Item');

module.exports.get_cart_items = async (req,res) => {
    const userId = req.params.id;
    try{
        let cart = await Cart.findOne({userId});
        if(cart && cart.items.length>0){
            res.send({
                status: true,
                message: 'Cart item(s) found',
                data: cart
            });
        }
        else{
            res.status(404).send({
                status: true,
                message: 'No cart item found',
                data: null
            });
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send({
            status: false,
            message: 'Something went wrong while fetching cart items!',
            data: null
        });
    }
}

module.exports.add_cart_item = async (req,res) => {
    const userId = req.params.id;
    const { productId, quantity } = req.body;

    try{
        let cart = await Cart.findOne({userId});
        let item = await Item.findOne({_id: productId});
        if(!item){
            res.status(404).send({
                status: false,
                message: 'Item not found',
                data: null
            })
        }
        const price = item.price;
        const name = item.title;

        if(cart){
            // if cart exists for the user
            let itemIndex = cart.items.findIndex(p => p.productId === productId);

            // Check if product exists or not
            if(itemIndex > -1)
            {
                let productItem = cart.items[itemIndex];
                productItem.quantity += quantity;
                cart.items[itemIndex] = productItem;
            }
            else {
                cart.items.push({ productId, name, quantity, price });
            }
            cart.bill += quantity*price;
            cart = await cart.save();
            return res.status(201).json({
                status: true,
                message: 'Item(s) added to cart',
                data: cart
            });
        }
        else{
            // no cart exists, create one
            const newCart = await Cart.create({
                userId,
                items: [{ productId, name, quantity, price }],
                bill: quantity*price
            });
            return res.status(201).json({
                status: true,
                message: 'Item(s) added to cart',
                data: newCart
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}

module.exports.delete_item = async (req,res) => {
    const userId = req.params.userId;
    const productId = req.params.itemId;
    try{
        let cart = await Cart.findOne({userId});
        let itemIndex = cart.items.findIndex(p => p.productId === productId);
        if(itemIndex > -1)
        {
            let productItem = cart.items[itemIndex];
            cart.bill -= productItem.quantity*productItem.price;
            cart.items.splice(itemIndex,1);
        }
        cart = await cart.save();
        return res.status(201).json({
            status: true,
            message: 'Cart item deleted',
            data: cart
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            status: true,
            message: 'Something went wrong adding item to cart',
            data: null
        });
    }
}
