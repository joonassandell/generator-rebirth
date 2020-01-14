module.exports.copy = function(source, destination, gen) {
  gen.fs.copyTpl(
    gen.templatePath(source),
    gen.destinationPath(destination),
    gen,
  );
};
