
const getUserStats = async (userId) => {
  // Fetch stats from DB if stored
  return {
    itemsTracked: 23, // Example
    foodDonated: 15,
    wasteSaved: "18",
  };
};

module.exports = getUserStats;
