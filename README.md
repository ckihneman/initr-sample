# Initr Sample

A sample project for setting up [Initr](https://github.com/mindgruve/initr).

This repo serves as a complete example of how to set up Initr for development and production. The bulk of the work is handled by [grunt](http://gruntjs.com/).

While this example uses php to hold a configuration variable, this can easily be substituted out for any other server language. The point here is to not have to update your HTML and JavaScipt for development or production. Change one config var on your server from `true` to `false` and Initr will begin fetching minified versions of your scripts.

Built by [Chris Kihneman](http://ckihneman.github.com/) at [Mindgruve](http://mindgruve.com/).

## Get it running

[Install](http://nodejs.org/) `node` and `npm`version `>=0.8.0`.

[Install](http://gruntjs.com/getting-started) `grunt` version `>=0.4.0`.

Clone or fork this repo, `git clone https://github.com/mindgruve/initr-sample.git initr-sample`. Then `cd initr-sample`.

Now you can run `grunt` and get a fresh build of your minified files.

To see the sample in action, you need to boot up a server. Luckily, we can use `grunt-php` ([docs](https://github.com/sindresorhus/grunt-php)) to help us boot one up real quick. The requirement here is to have PHP 5.4.0+ installed on your machine and in your path. You could always use MAMP or the like as well.

Boot up the server with `grunt server`. The default port is `8000`. So after running the command you will be prompted to open `http://localhost:8000` in your browser.

By default, the project is in development mode. Meaning scripts loaded will not be minified, and Initr will be in development mode as well. Open your console and take a look at the logs.

To put the project into production mode, open `web/config.php` in a text editor, and change `$IS_DEV` to `false`. Refresh your browser, and now all scripts being loaded are minified.

From here, it is really best to take a look through the project, especially `Gruntfile.js`, `web/index.php` and `web/javascript/initr.config.js`.

## Documentation

Put your scripts in `web/javascript/`.

Put vendor scripts (code that is not yours) in `web/javascript/vendor/`.

After making any changes to your files, you will need to run `grunt` to prep your scripts for production.

You can run `grunt watch` to lint your files as you work.

Grunt is doing the heavy lifting here. Lets outline what exactly it does when you run `grunt`.

* Removes the folder `web/javascript/min/` that has your minified scripts inside, as we will be replacing it with a fresh copy of all your scripts.

* Lints (via jshint) `Gruntfile.js` and all scripts in `web/javascript/`. However, it will not lint any of these scripts because they are either already minified, or they are not your code:

	* Scripts with the extension `.min.js`.
	* Scripts in your `web/javascript/vendor/` folder.
	* Scripts in your `web/javascript/min/` folder (we will be compiling these linted scripts here).

* Concatenates `web/javascript/vendor/consoleshiv.js`, `web/javascript/vendor/initr.js` and `web/javascript/initr.config.js` into one, temporary file `temp/core.js`. These are our core scripts to be loaded on every page of our website. This temporary file is then minified and copied to `web/javascript/min/core.js`. This is our production script file to rule them all.

* Every script in `web/javascript/` is then minified into `web/javascript/min/`, excluding our core files above. This step is the big one for Initr to run its best in production. We have replicated our script file structure minified. Now when we kick off Initr with its `rootPath` set as `javascript/min/`, it will fetch minified versions of all your files. All you have to do is change your server configuration variable for development to `false` for production.

* Last, our `temp/core.js` file is cleaned up (deleted).

Once you have updated this project with all of your code, be sure to update the values for `author` in `initr.sample.json`. The banner added to the top of your `web/javascript/min/core.js` file uses the company value. You can remove this if you like by deleting `uglify.core.options.banner` on line 35 in `Gruntfile.js`.

Grunt can do a lot for your projects, be sure to read through their [docs](http://gruntjs.com/getting-started) if you want more.
