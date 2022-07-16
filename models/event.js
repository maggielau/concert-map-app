let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let EventSchema = new Schema({
        date: {type: String, require: true},
        venueName: {type: String, required: true},
        position: {
            lat: {type: Number, required: true},
            lng: {type: Number, required: true}
        },
        artists: [{type: String, required: true}],
        doors: {type: String},
        cost: {type: String},
        purchaseURL: {type: String},
}, { _id: false });

module.exports = mongoose.model('Event', EventSchema);