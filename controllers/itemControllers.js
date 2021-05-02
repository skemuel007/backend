const Item = require('../models/Item');

module.exports.get_items = (req,res) => {
    Item.find().sort({date:-1}).then(items => res.json({
        data: items,
        status: true,
        message: items?.length > 0 ? 'Records found' : 'No items record found'
    }));
}

module.exports.post_item = (req,res) => {
    const newItem = new Item(req.body);
    newItem.save().then(item => res.status(201).json(
        {
            status: true,
            message: 'Record saved successfully',
            data: item
        }));
}

module.exports.update_item = (req,res) => {
    Item.findByIdAndUpdate({_id: req.params.id},req.body).then(function(item){
        Item.findOne({_id: req.params.id}).then(function(item){
            res.json({
                status: true,
                message: 'Record updated successfully',
                data: item
            });
        });
    });
}

module.exports.delete_item = (req,res) => {
    Item.findByIdAndDelete({_id: req.params.id}).then(function(item){
        res.json({
            status: true,
            message: 'Record deleted',
            data: null
        });
    });
}
