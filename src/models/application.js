module.exports = (sequelize, DataTypes, Sequelize) => {
    const Application = sequelize.define('application', {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        status: {
            type: DataTypes.ENUM,
            values: ['cancelled', 'reviewing', 'pending'],
            defaultValue:'pending'
        }
    });
    return Application;
}
