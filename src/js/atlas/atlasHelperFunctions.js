const atlasHelperFunctions = {
  getAllAgencies({
    nationalMapData,
  }) {
    return nationalMapData
      .reduce((accumulator, msa) => [...accumulator, ...msa.ta], [])
      .sort((a, b) => b.upt2017 - a.upt2017);
  },
};

export default atlasHelperFunctions;
