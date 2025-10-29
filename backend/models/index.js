const Sequelize = require('sequelize');
const User = require('./user');
const Comment = require('./comment');
const Plan = require('./plan');
const AllPlan = require('./allPlan');
const Suggest = require('./suggest');

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
    AllPlan,
    Suggest
};

User.init(sequelize);
Comment.init(sequelize);
Plan.init(sequelize);
AllPlan.init(sequelize);
Suggest.init(sequelize);

User.associate(db);
Comment.associate(db);

module.exports = db;
