// models/Booking.js
module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define("Booking", {
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
    });
  
    Booking.associate = (models) => {
      Booking.belongsTo(models.User, { foreignKey: "userId" });
      Booking.belongsTo(models.Property, { foreignKey: "propertyId" });
    };
  
    return Booking;
  };  