const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/learn', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function main() {
    let schema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'fuck you'],
            validate: {
                validator: async (v) => {
                    return false;
                },
                message: 'async false'
            }
        }
    });
    let Cat = mongoose.model('Cat', schema);

    // require validator
    const requireValidator = async() => {
        let cat = new Cat();
        try {
            const res = await cat.save();
            console.log(res);
        }  catch(err) {
            console.log(err);
        }
    };

    const asyncValidator = async() => {
        const cat = new Cat({name: 'fuck'});
        try {
            const res = await cat.save();
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    }

    let childSchema = new mongoose.Schema({type: String });
    let parentSchema = new mongoose.Schema({
        children: [childSchema],
        child: childSchema
    });
    let parentModel = mongoose.model('parentModel', parentSchema);
    parentModel.schema.path('child').validate(function(v) {
        console.log('children validator of parent');
        return true;
    }, 'fuck, i don\'t have a child');
    
    res = await parentModel.update({}, {children: null}, {runValidators: true});
    console.log(res);

    res = await parentModel.find();
    console.log(res);
}

main();