---
layout: post
title:  Using Jekyll with Pages
date:   2015-2-13 23:28:58
categories: design markdown
tags: Design Markdown
---
Using Jekyll with Pages
============
In addition to supporting regular HTML content, GitHub Pages support [Jekyll](https://github.com/jekyll/jekyll), a simple, blog-aware static site generator. Jekyll makes it easy to create site-wide headers and footers without having to copy them across every page. It also offers [some other advanced templating features](http://jekyllrb.com/docs/templates/).

Using Jekyll
------------

Every GitHub Page is run through Jekyll when you push content to a specially named branch within your repository. For User Pages, use the `master` branch in your username.github.io repository. For Project Pages, use the gh-pages branch in your project's repository. Because a normal HTML site is also a valid Jekyll site, you don't have to do anything special to keep your standard HTML files unchanged. Jekyll has thorough documentation that covers its features and usage. Simply start committing Jekyll formatted files and you'll be using Jekyll in no time.

Installing Jekyll
------------

We highly recommend installing Jekyll on your computer to preview your site and help diagnose troubled builds before publishing your site on GitHub Pages.

Luckily, installing Jekyll on your computer, and ensuring your computer most closely matches the GitHub Pages settings is easy, thanks to the GitHub Pages Gem and our dependency versions page. To install Jekyll, you'll need a few things:

1. Ruby - Jekyll requires the Ruby language. If you have a Mac, you've most likely already got Ruby. If you open up the Terminal application, and run the command ruby --version you can confirm this. Your Ruby version should begin with 1.9.3 or 2.0.0. If you've got that, you're all set. Skip to step #2. Otherwise, follow these instructions to install Ruby.
2. Bundler - Bundler is a package manager that makes versioning Ruby software like Jekyll a lot easier if you're going to be building GitHub Pages sites locally. If you don't already have Bundler installed, you can install it by running the command gem install bundler.
3. Jekyll - The main event. You'll want to create a file in your site's repository called Gemfile and add the line gem 'github-pages'. After that, simply run the command, bundle install and you're good to go. If you decided to skip step #2, you can still install Jekyll with the command gem install github-pages, but you may run into trouble down the line. Here’s an example of a Gemfile you can use (placed in the root directory of your repository)