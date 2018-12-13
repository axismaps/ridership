const getGetAllAgenciesForCurrentMSA = ({ data }) => function getAllAgenciesForCurrentMSA() {
  /**
   * Returns all agencies for current MSA
   * @private
   */
  const currentMSA = this.get('msa');
  const ta = data.get('ta');
  if (currentMSA === null) return null;
  return ta
    .filter(d => d.msaId === currentMSA.msaId);
};

export default getGetAllAgenciesForCurrentMSA;
