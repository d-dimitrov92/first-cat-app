const Cat = require('../models/Cat')

async function getAllCats(query) {
    const name = { $regex: query.search, $options: 'i' };
    const cats = await Cat.find({name}).lean();

    return cats;
}

async function getCatById(id) {
    const cat = await Cat.findById(id).lean();

    return cat;
}

async function createCat(catData) {
    const pattern = new RegExp(`^${catData.name}$`, 'i');
    const existing = await Cat.findOne({ name: { $regex: pattern } });

    if (existing) {
        throw new Error('A cat with this name already exists.');
    }
    const cat = new Cat(catData);

    await cat.save();

    return cat;
}

async function editCat(id, catData) {
    const cat = await Cat.findById(id);

    cat.name = catData.name;
    cat.description = catData.description;
    cat.imageUrl = catData.imageUrl;

    return await cat.save();
}

async function deleteCat(id) {
    return Cat.findByIdAndDelete(id);
}

module.exports = {
    getAllCats,
    createCat,
    getCatById,
    editCat,
    deleteCat
}