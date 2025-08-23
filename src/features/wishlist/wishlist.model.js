const mogoose = require('mongoose');
const whishListSchema = new mongoose.Schema(
    {
        User: {
            type: mogoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        items: [
            {


                Product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product'
                },
                Variant: {
                    type: mogoose.Schema.Types.ObjectId,
                    ref: 'Variant'
                },
                addedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ]

    }


);

module.exports = mongoose.model("Whishlist", whishListSchema);