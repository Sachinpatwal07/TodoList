exports.getDate = function() {


  const date = new Date();

  const option = {

    weekday: "long",
    day: "numeric",
    year: "numeric",
    month: "long",

  }
  return date.toLocaleString('en-US', option);
}

exports.getDay = function() {

  const date = new Date();

  const option = {

    weekday: "long",

  }

  return date.toLocaleString('en-US', option);

}
