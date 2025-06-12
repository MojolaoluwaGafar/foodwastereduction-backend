
const getUserStats = async (userId) => {
  // Fetch stats from DB if stored
  return {
    itemsTracked: 10, // Example
    foodDonated: 3,
    wasteSaved: "15",
  };
};

module.exports = getUserStats;
