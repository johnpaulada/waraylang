const { FuseBox } = require("fuse-box");
const fuse = FuseBox.init({
    homeDir: "src",
    output: "dist/$name.js",
    globals: { default: "waraylang" }
});
fuse.bundle("waraylang")
    .instructions(`>index.js`);

fuse.run();

// TODO: Implement as CLI
// TODO: Convert to ES5 (Babel)
// TODO: Uglify JS