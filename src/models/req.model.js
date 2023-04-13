module.exports = (sequelize, DataTypes, Sequelize) => {
    const Req = sequelize.define('req', {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        subject: {
            type: DataTypes.STRING,
            maxLength: 50
        },
        text: {
            type: DataTypes.TEXT,
            maxLength: 500
        },
        tags: {
            type: DataTypes.TEXT,
            maxLength: 200
        }
    });
    return Req;
}