export default (sequelize, DataTypes) => {
    const Categoria = sequelize.define('Categoria', {
        id_categoria: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    }, 
    {
        tableName: 'categorias',
        timestamps: false
    });

    return Categoria;
};