# Roundcube FileAPI-Attachments ![project status](http://stillmaintained.com/mkrauser/roundcube_fileapi_attachments.png) #

## Maintainer Contact

Matthias Krauser
mail:    <matthias (at) krauser (dot) eu >
twitter: @mat_krauser 

## Changelog

### 0.7.0 (2012-03-04)
* changed api to support roundcube 0.7

### 0.6.0 (2011-10-01)
* changed api to support roundcube 0.6
* migrated from private svn repository to github (https://github.com/mkrauser/roundcube_fileapi_attachments)
* changed versioning to match roundcube versions (plugin versions 0.6.x will be for roundcube 0.6.x, 0.7.x will work with rc 0.7 etc).

### 0.3.0 (2011-03-17)
* added support for Webkit-Browsers (Chrome and others) (thanks to Thomas Yu for the Patch)

### 0.2.1 (2011-03-11)
* [FIXED] missing comma (thanks to Guillaume Germain for the hint)

### 0.2 (2011-03-10)
* [FIXED] wrong filename of fileapi.js (thanks to Guillaume Germain for the hint)
* Chrome is not supported (see http://code.google.com/p/chromium/issues/detail?id=35705)

### 0.1 (2011-02-03)
* Initial Release

## Roadmap

### next release
* Improve the design, a bit like the drop-area shown here (https://github.com/silverstripe/silverstripe-design/blob/master/Design/ss3-ui_files-manager-add-files.jpg)

## Requirements

- Roundcube 0.6 (used for development and testing of 0.6-branch)
- In this Version, Firefox 3.6+ and Chrome are supported

## Documentation

Use's the HTML5-FileApi to upload Attachments
(testet in FF 3.6 on Ubuntu and Firefox 4b and Chrome10 on Windows )

For now, this is only a proof-of-concept, there a many hacks in the code
If you have any hints or suggestions, feel free to contact me.

## Installation

Copy the plugin in the plugins-directory of your Roundcube installation and activate it in your main-config-file, that's it.