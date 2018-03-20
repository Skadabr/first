const globby = require("globby");
const fs = require("fs");

async function main() {
  const files = await globby("server/src/**/*.ts");

  for (const file of files) {
    const content = fs.readFileSync(file, { encoding: "utf8" });
    const lines = content.split(/\n/);
    const linesInCamelCase = lines.map(l => {
      const hasSnakeCaseRegEx = /.+_[a-z1-9].*/g;
      if (hasSnakeCaseRegEx.test(l)) {
        l = l.replace(/\B(_[a-z1-9])/g, m => m[1].toUpperCase());
        return l;
      }
      return l;
    });
    fs.writeFileSync(file, linesInCamelCase.join("\n"));
  }
}

main().catch(console.error);
