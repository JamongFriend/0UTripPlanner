const Sequelize = require('sequelize');

module.exports = class Plan extends Sequelize.Model {
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
    // Plan이 AllPlan에 속하는 관계 설정
    static associate(db) {
        Plan.belongsTo(db.AllPlan, { foreignKey: 'allPlanId' });
    }
};