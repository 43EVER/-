const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/learn', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function main() {
    let childSchema = new mongoose.Schema({ name: String });
    let parentSchema = new mongoose.Schema({
        children: [childSchema],
        child: childSchema
    });
    let Parent = mongoose.model('Parent', parentSchema);

    // find and execute
    const execute = async() => {
        const res = await Parent.findOne();
        console.log(res);
    };

    // find
    const find = async () => {
        const query = Parent.findOne();
        query.select('children child');
        const res = await query.exec();
        console.log(res);
    };

    // stream
    console.log('stream begin');
    const cursor = Parent.find().cursor();
    cursor.on('data', (doc) => {
        console.log(doc);
    });
}

main();