const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/learn', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

async function main() {
    await new Promise((resolve, reject) => {
        db.on('error', (err) => {
            reject(err);
        });
        db.once('open', () => {
            resolve();
        });
    });

    const kittySchema = new mongoose.Schema({
        name: String
    });

    kittySchema.methods.speak = function () {
        const greeting = `${this.name ? 'Meow name is ' + this.name : 'I don\'t have a name'}`;
        console.log(greeting);
    };

    const Kitten = mongoose.model('Kitten', kittySchema);

    const silence = new Kitten({ name: 'Silence' });
    console.log(silence);
    silence.speak();

    const fluffy = new Kitten({ name: 'fluffy' });

    // begin save
    // const silensRes = await silence.save();
    // const fluffyRes = await fluffy.save();

    // begin query
    console.log('begin query');
    const res = await Kitten.find({ name: /^fluffy/ });
    console.log(res);
}

main();