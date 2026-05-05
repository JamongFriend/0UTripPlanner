const Sequelize = require('sequelize');

module.exports = class Plan extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: Sequelize.STRING(100),
                allowNull: false,
                primaryKey: true
            },
            userId: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            planName: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            startDate: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            endDate: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            personnel: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            purpose: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            place: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            isShared: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            isMarked: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            likes: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Plan',
            tableName: 'plans',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    
    static associate(db) {
        db.Plan.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id' });
        db.Plan.hasMany(db.DayPlace, { foreignKey: 'planId', sourceKey: 'id', as: 'dayPlaces', onDelete: 'CASCADE' });
    }
};