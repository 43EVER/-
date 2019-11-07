const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/learn', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function main() {
    let kittySchema = new mongoose.Schema({
        name: String
    });
    let Kitty = mongoose.model('Kitten', kittySchema);
    let res = await Kitty.find().limit(1);
    console.log(res);

    // begin update
    await Kitty.findOneAndUpdate(res, { $set: {name: 'liuyang'}});
    res = await Kitty.find();
    console.log(res);

    // begin old_style update
    Kitty.findOne((err, res) => {
        err && console.log('error ' + err);
        res && console.log('success' + res);
        res.name = 'dkm';
        res.save((err, updatedRes) => {
            err && console.log('error ' + err);
            updatedRes && console.log('success ' + updatedRes);
        })
    });
}

main();