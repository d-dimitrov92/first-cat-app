const Cat = require('../models/Cat');
const User = require('../models/User');

async function getAllCats(query) {
    const options = {};
    const pageOptions = {}
    const cats = {};

    // add name property to options object if we have search in query
    if (query.search) {
        options.name = { $regex: query.search, $options: 'i' };
    }

    // add page property to pageOptions object and set default value to 1
    if (query.page) {
        pageOptions.page = parseInt(query.page);
    } else {
        pageOptions.page = 1;
    }

    // add limit property to pageOptions object and set default value to 3
    if (query.limit) {
        pageOptions.limit = parseInt(query.limit);
    } else {
        pageOptions.limit = 3
    }

    //index of first rendered cat
    const startIndex = (pageOptions.page - 1) * pageOptions.limit;
    //index of last rendered cat
    const endIndex = pageOptions.page * pageOptions.limit;

    // prev and next functionality: assign to cats object 2 properties: next and prev
    if (endIndex < await Cat.countDocuments().exec()) {
        cats.next = {
            page: pageOptions.page + 1,
            limit: pageOptions.limit
        }
    }

    if (startIndex > 0) {
        cats.prev = {
            page: pageOptions.page - 1,
            limit: pageOptions.limit
        }
    }
    // assign to cats object catsList from DB
    cats.catsList = await Cat.find(options)
        .limit(pageOptions.limit)
        .skip(startIndex)
        .sort({ createdAt: 'desc' })
        .lean();

    // preventing display next button when use search **bug**
    if (cats.catsList.length < pageOptions.limit) {
        cats.next = {};
    }

    return cats;
}

async function getCatById(id) {
    const cat = await Cat.findById(id).lean();
    return cat;
}

async function createCat(catData, id) {
    const pattern = new RegExp(`^${catData.name}$`, 'i');
    const existing = await Cat.findOne({ name: { $regex: pattern } });
    const user = await User.findById(id);

    if (existing) {
        throw new Error('A cat with this name already exists.');
    }

    const cat = new Cat(catData);
    user.givenCats.push(cat);

    await cat.save();
    await user.save();

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