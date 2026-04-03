// Allow build scripts for esbuild
function readPackage(pkg, context) {
  return pkg;
}

module.exports = {
  hooks: { readPackage },
};
