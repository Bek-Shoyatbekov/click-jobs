module.exports = (sequelize, DataTypes, Sequelize) => {
    const Req = sequelize.define('req', {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        text: {
            type: DataTypes.TEXT,
            maxLength: 500
        }
    });
    return Req;
}