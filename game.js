/*
 *  Public
 */
var rolesLibres = ["Inspecteur", "Coupable"];
exports.rolesLibres = rolesLibres;

module.exports = {
  /*
   * @desc Remplis rolesLibres de rôles pour en avoir pour tous les joueurs
   * @param int nbrJoueurs: Nombre de joueurs connectés
   * @return 0
   */
  fillRoles: function(nbrJoueurs) {
    rolesLibres = ["Inspecteur", "Coupable"];
    if (nbrJoueurs > 2) {
      for (i = 2; i < nbrJoueurs; i++) {
        rolesLibres.push("Innocent");
      }
    }
  },
  /*
   * @desc Retourne un rôle aléatoire en le supprimant de la liste
   * @param
   * @return string role: Un rôle aléatoire
   */
  donneRole: function() {
    var r = Math.floor((Math.random() * rolesLibres.length));
    role = rolesLibres.splice(r, 1)[0];
    return role;
  }
};

/*
 *  Private
 */

var roles = ["Inspecteur", "Coupable"]; // Rôles importants
