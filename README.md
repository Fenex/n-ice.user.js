# n-ice.user.js
Userscript provides additional functionality on n-ice.org (OpenTTD community)

## Build project
* Clone the repository.
* Install necessary utils:
* * NodeJS & npm as "must have";
* * Install project depends: `npm install`;
* * Install `browserify` with global flag: `npm install -g browserify`.

After installing all the necessary utilities and dependencies, the following commands will available:

`grunt` - build the project:
* puts an output js-file without metadata (UserJS header) into `/dev/build.js`;
* puts an output js-file with metadata into /dist/%project_name%-%version%.user.js.

`grunt watch` - starts to listen for changing all depends js-modules and runs task `grunt` when the event occurred.

`grunt prod` - like `grunt` but additional will be created uglify js-file into `/dist/%project_name%-%version%.min.user.js`.

## Development
`/dev/` directory includes a chromium extension was added to the project for more simply development.
For installing the extension you must:
* Open extensions page on your chromium browser. (`Settings`->`More Tools`->`Extensions`).
* Turn on `developer mode`.
* Click on `Load unpacked` button. Choose `%repository%/dev/` folder.

Now, if you run `grunt watch` command, you are seeing your changes when you will reload a web page. You don't have reinstall the extension.
