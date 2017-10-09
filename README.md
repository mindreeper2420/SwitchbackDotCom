# Switchback, Inc.

Switchback, Inc. is a full-service computer consulting company providing software solutions for a wide range of small, medium, and large businesses.

In business since March of 1983 and incorporated since January of 1986, Switchback, Inc. has developed a large amount of expertise in multi-user applications. In addition to computer consulting, Switchback, Inc. also provides Web and UI development services.

Find us at http://switchback.com or on Twitter [@Switchback_Inc](https://twitter.com/Switchback_Inc).

----

## To run this site locally, you will need the following:
* node
* gulp
* jekyll
* ruby

### with the following commands:
* `gem install bundler`
* `npm install`
* `gulp initialize`

#### commands to run the site:
* `jekyll serve`

This site uses **stylelint** to check for any `sass` errors, and **html-proofer** the check for any errors on the jekyll build.
* To run stylelint, you can use `gulp sass` to run the gulp command that will check for style errors against the `.stylelintrc` file.
* To use html-proofer locally, run `bundle exec htmlproofer ./_site --disable-external` after you have built the site for the first time.