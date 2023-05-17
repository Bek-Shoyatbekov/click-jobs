
module.exports = (sequelize, DataTypes, Sequelize) => {
    const Message = sequelize.define('message', {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        to: {
            type: DataTypes.UUID,
            allowNull: false
        },
        from: {
            type: DataTypes.UUID,
            allowNull: false
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false
        },
    });
    return Message;
}
