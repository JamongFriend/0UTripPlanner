const Sequelize = require('sequelize');
const User = require('./user');
const Comment = require('./comment');
const Plan = require('./plan');
const Suggest = require('./suggest');
const DayPlace = require('./dayPlace');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const sequelize = new Sequelize(
    config.database, config.username, config.password, config
);

const db = {
    sequelize,
    User,
    Comment,
    Plan,
    Suggest,
    DayPlace
};

User.init(sequelize);
Comment.init(sequelize);
Plan.init(sequelize);
Suggest.init(sequelize);
DayPlace.init(sequelize);

User.associate(db);
Comment.associate(db);
Plan.associate(db);
DayPlace.associate(db);

module.exports = db;
