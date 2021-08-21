module.exports.getdate = getdate;
function getdate() {
    var today = new Date();
    var opt = {
      weekday: "long",
      day: "numeric",
      month: "long",
    };
    return today.toLocaleDateString("en-US", opt);
     
}