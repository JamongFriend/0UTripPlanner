const Sequelize = require('sequelize');

module.exports = class AllPlan extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: Sequelize.STRING(100),
                allowNull: false,
                primaryKey: true
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
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'AllPlan',
            tableName: 'all_plans',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        AllPlan.hasMany(db.Plan, { foreignKey: 'allPlanId' });
    }
};