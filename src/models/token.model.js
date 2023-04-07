module.exports = (sequelize, DataTypes, Sequelize) => {
    const Token = sequelize.define('token', {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });
    return Token;
}