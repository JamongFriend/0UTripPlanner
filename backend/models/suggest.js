const Sequelize = require('sequelize');

module.exports = class Suggest extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            place: {
                type: Sequelize.STRING(255),
                allowNull: true
            },
            hotel: {
                type: Sequelize.STRING(255),
                allowNull: true
            },
            restaurant: {
                type: Sequelize.STRING(255),
                allowNull: true
            },
            latitude: {
                type: Sequelize.DECIMAL(10, 8), // 위도
                allowNull: true
            },
            longitude: {
                type: Sequelize.DECIMAL(11, 8), // 경도
                allowNull: true
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Suggest',
            tableName: 'suggests',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
};
