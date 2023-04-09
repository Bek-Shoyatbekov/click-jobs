module.exports = (sequelize, DataTypes, Sequelize) => {
    const Code = sequelize.define('code', {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        userEmail: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        code: {
            type: DataTypes.STRING,
            allowNul: false
        }

    });
    return Code;
}