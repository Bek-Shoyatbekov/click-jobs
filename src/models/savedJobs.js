module.exports = (sequelize, DataTypes, Sequelize) => {
    const Saved = sequelize.define('saved', {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        // jobId: {
        //     type: DataTypes.UUID,
        //     allowNull: false,
        // }
    });
    return Saved;
}