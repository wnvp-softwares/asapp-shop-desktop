module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_completo: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    usuario: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    pass: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'usuarios',
    timestamps: false
  });

  Usuario.associate = (models) => {
    Usuario.belongsTo(models.Rol, {
      foreignKey: 'id_rol',
      as: 'rol'
    });
  };

  return Usuario;
};