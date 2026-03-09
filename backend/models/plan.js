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
            hotel: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            restaurant: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Plan',
            tableName: 'plans',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    
    static associate(db) {
        db.Plan.belongsTo(db.AllPlan, { foreignKey: 'allPlanId' });

        db.Plan.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id' });
    }
};