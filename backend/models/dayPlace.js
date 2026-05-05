const Sequelize = require('sequelize');

module.exports = class DayPlace extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            planId: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            day: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: '여행 몇 일차인지 (1, 2, 3...)'
            },
            time: {
                type: Sequelize.STRING(5),
                allowNull: true,
                comment: '일정 시각 HH:MM 형식 (예: 09:00)'
            },
            title: {
                type: Sequelize.STRING(100),
                allowNull: false,
                comment: '일정 제목 (예: 출발, 점심, 박물관 관람)'
            },
            category: {
                type: Sequelize.ENUM('이동', '숙소', '식사', '관광', '기타'),
                allowNull: false,
                defaultValue: '기타'
            },
            placeName: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            address: {
                type: Sequelize.STRING(255),
                allowNull: true
            },
            latitude: {
                type: Sequelize.DECIMAL(10, 7),
                allowNull: true
            },
            longitude: {
                type: Sequelize.DECIMAL(10, 7),
                allowNull: true
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'DayPlace',
            tableName: 'day_places',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.DayPlace.belongsTo(db.Plan, { foreignKey: 'planId', targetKey: 'id', onDelete: 'CASCADE' });
    }
};
