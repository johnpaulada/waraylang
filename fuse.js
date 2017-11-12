const { FuseBox } = require("fuse-box");
const fuse = FuseBox.init({
    homeDir: ".",
    output: "dist/$name.js",
    globals: { default: "waraylang" }
});
fuse.bundle("waraylang")
    .instructions(`>index.js`);

fuse.run();