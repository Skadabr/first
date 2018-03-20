const globby = require("globby");
const fs = require("fs");

async function main() {
  const files = await globby("core/src/**/*.ts");

  for (const file of files) {
    const content = fs.readFileSync(file, { encoding: "utf8" });
    const lines = content.split(/\n+/);
    const linesWithSnakeCase = lines.filter(l => {
      const regex = /.+_[a-z1-9].*/g;
      return regex.test(l);
    })
    console.log(linesWithSnakeCase[0]);
  }
}

main().catch(console.error);
