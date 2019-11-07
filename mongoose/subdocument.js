const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/learn', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function main() {
    let childSchema = new mongoose.Schema({ name: String });
    childSchema.pre('save', function(next) {
        console.log('child save');
        next();
    });
    childSchema.pre('validate', function(next) {
        console.log('child validate');
        next();
    });
    let parentSchema = new mongoose.Schema({
        children: [childSchema],
        child: childSchema
    });
    parentSchema.pre('save', function(next) {
        console.log('parent save');
        next();
    });
    parentSchema.pre('validate', function(next) {
        console.log('parent validate');
        next();
    });

    let Parent = mongoose.model('Parent', parentSchema);
    let children = new Array(3).fill({
        name: 'liuyang'
    });

    // begin create
    const create = async() => {
        const res = await Parent.create(new Parent({
            children,
            child: { name: 'liuyang' }
        }));
        console.log(res);
    };
    await create();
    await create();
    // end create

    // begin find
    const find = async () => {
        const res = await Parent.find();
        console.log(res);
        res[0].remove();
        await res[0].save();

        const res1 = await Parent.find();
        console.log('res1 ' + res1);
    }

    find();
}

main();