module.exports = (sequelize, DataTypes, Sequelize) => {
    const Network = sequelize.define('network', {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        provider: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        provider_id: {
            type: DataTypes.STRING,
            allowNul: false
        },
        username: {
            type: DataTypes.STRING,
            allowNul: false
        },
        email: {
            type: DataTypes.STRING,
            allowNul: false
        },
        accessToken: {
            type: DataTypes.STRING,
        },
        refreshToken: {
            type: DataTypes.STRING,
        },

    });
    return Network;
}