const { FuseBox } = require("fuse-box");

const fuse = FuseBox.init({
    homeDir: "src",
    output: "dist/$name.js",
    globals: { default: "waraylang" }
});

fuse.bundle("waraylang")
    .instructions(`>index.js`);

fuse.run();

// TODO: Simplify code for expression operator cases
// TODO: Extract operators etc. to their own files
// TODO: Implement as CLI
// TODO: Convert to ES5 (Babel)
// TODO: Uglify JS
// TODO: Tagalog and waray for syntax and errors
// TODO: Refactor code