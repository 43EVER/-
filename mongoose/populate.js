const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/learn', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function main() {
    let personSchema = new mongoose.Schema({
        name: String,
        age: Number,
        stories: [{
            type: mongoose.SchemaTypes.ObjectId, ref: 'Story'
        }]
    });
    let storySchema = new mongoose.Schema({
        author: { type: mongoose.SchemaTypes.ObjectId, ref: 'Person' },
        title: String,
        fans: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Person' }]
    });

    let Story = mongoose.model('Story', storySchema);
    let Person = mongoose.model('Person', personSchema);

    
}

main();