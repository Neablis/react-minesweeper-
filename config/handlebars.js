var Handlebars = require('handlebars');
var libpath    = require('path');
var Swag = require('swag');
var escape = Handlebars.Utils.escapeExpression;

Swag.registerHelpers(Handlebars);

// -- Helpers ------------------------------------------------------------------

Handlebars.registerHelper('getFlashObj',function getFlashObj(messages, entry, key) {
    var arr = messages[entry];
    var obj = {};
    if (arr && arr.length) {
        obj = arr[0];
    }
    return obj[key] || '';
});

Handlebars.registerHelper('printFlash',function printFlash(messages) {
    var output = [];
    var messages = messages || {};
    var extractMessages = function (obj) {
        var messages = [];
        if (obj.message) return [obj.message];

        Object.keys(obj).forEach(function (key) {
            if (obj[key].length) {
                obj[key].forEach(function (item) {
                    if (item.message) messages.push(item.message);
                });
            }
        });

        return messages;
    }
    var classForType = function (type) {
        if (type === 'error') {
            return 'alert-danger';
        }
        if (type === 'success') {
            return 'alert-success';
        }

        return 'alert-info';
    };
    var validTypes = ['error', 'success', 'info'];

    Object.keys(messages).forEach(function (messageType) {
        if (validTypes.indexOf(messageType) > -1) {
            messages[messageType].forEach(function (message) {
                if (typeof(message) === 'object') {
                    extractMessages(message).forEach(function (msg) {
                        output.push('<div class="alert '+ classForType(messageType) + '">' + msg + '</div>');
                    });
                } else {
                    output.push('<div class="alert ' + classForType(messageType) + '">' + message + '</div>');
                }
            });
        }
    });

    output = output.join('\n');

    return new Handlebars.SafeString(output);
});

Handlebars.registerHelper('addLocalCSS',function addLocalCSS(path, options) {
    var css   = this.localCSS || (this.localCSS = []),
        entry = {};

    if (this.relativePath) {
        path = libpath.relative(this.relativePath, path);
    }

    entry.path = path;

    if (options.hash.hasOldIE) {
        entry.oldIE = libpath.join(
            libpath.dirname(path),
            libpath.basename(path, '.css') + '-old-ie.css'
        );
    }

    css[options.hash.prepend ? 'unshift' : 'push'](entry);
});

Handlebars.registerHelper('addRemoteCSS',function addRemoteCSS(path, options) {
    var css = this.remoteCSS || (this.remoteCSS = []);
    css[options.hash.prepend ? 'unshift' : 'push'](path);
});


Handlebars.registerHelper('addLocalJS',function addLocalJS(path, options) {
    var js = this.localJS || (this.localJS = []);

    if (this.relativePath) {
        path = libpath.relative(this.relativePath, path);
    }

    js[options.hash.prepend ? 'unshift' : 'push'](path);
});


Handlebars.registerHelper('localCSS',function localCSS(options) {
    var entries   = this.localCSS,
        output    = '',
        comboPath = '/combo/' + this.version + '?';

    if (!(entries && entries.length)) { return output; }

    if (this.isProduction) {
        entries = entries.reduce(function (combo, entry) {
            if (entry.oldIE || combo.oldIEPaths) {
                combo.oldIEPaths || (combo.oldIEPaths = combo.paths.concat());
                combo.oldIEPaths.push(entry.oldIE || entry.path);
            }

            combo.paths.push(entry.path);
            return combo;
        }, {paths: []});

        entries = [{
            path : comboPath + entries.paths.join('&'),
            oldIE: entries.oldIEPaths && comboPath + entries.oldIEPaths.join('&')
        }];
    }

    entries.forEach(function (entry) {
        output += options.fn(entry);
    });

    return output;
});

Handlebars.registerHelper('remoteCSS',function remoteCSS(options) {
    var urls   = this.remoteCSS,
        output = '';

    if (!(urls && urls.length)) { return output; }

    urls.forEach(function (url) {
        output += options.fn(url);
    });

    return output;
});

Handlebars.registerHelper('localJS',function localJS(options) {
    var urls   = this.localJS,
        output = '';

    if (!(urls && urls.length)) { return output; }

    if (this.isProduction) {
        urls = ['/combo/' + this.version + '?' + urls.join('&')];
    }

    urls.forEach(function (url) {
        output += options.fn(url);
    });

    return output;
});

Handlebars.registerHelper('setTitle',function setTitle(title) {
    this.title = title;
});

Handlebars.registerHelper('setPageTitle',function setPageTitle(title) {
    this.pageTitle = title;
});

Handlebars.registerHelper('setPageSubtitle',function setPageSubtitle(subtitle) {
    this.pageSubtitle = subtitle;
});

Handlebars.registerHelper('setPageDescription',function setPageDescription(description) {
    this.pageDescription = description;
});

Handlebars.registerHelper('noQuotient ',function noQuotient (number, divisor) {
    number = parseFloat(number);
    divisor = parseFloat(divisor);
    if (number%divisor === 0) { return true; }
    else { return false; }
});

Handlebars.registerHelper('maxQuotient ',function maxQuotient (number, divisor) {
    number = parseFloat(number);
    divisor = parseFloat(divisor);
    if (number%divisor === divisor - 1) { return true; }
    else { return false; }
});

Handlebars.registerHelper('apiReference ',function apiReference (verticalName) {
    verticalName = verticalName.split(' ').join('');
    return '/reference/' + verticalName + 'Command';
});

Handlebars.registerHelper('addSectionHeading',function addSectionHeading(heading, options) {
    var headings = this.sectionHeadings || (this.sectionHeadings = []);
    options = (options && options.hash) || {};

    var tagname    = options.tagname || 'h3',
        classnames = options.classnames || 'content-subhead',
        id, html, anchor;

    // Remove HTML entities, and all chars except whitespace, word chars, and -
    // from the `heading`.
    // Jacked from: https://github.com/yui/selleck/blob/master/lib/higgins.js
    id = options.id ? options.id : heading.toLowerCase()
            .replace(/&[^\s;]+;?/g, '')
            .replace(/[^\s\w\-]+/g, '')
            .replace(/\s+/g, '-');

    anchor = '<a href="#' + id + '" class="sidebar-nav--link" title="Heading anchor">' + heading + '</a>';
    html = '<' + tagname + ' id="' + id + '" class="' + classnames + '">' +
               heading + 
           '</' + tagname + '>';

    headings.push(anchor);
    return new Handlebars.SafeString(html);
});


Handlebars.registerHelper('sectionHeading',function sectionHeading(options) {
    var headings = this.sectionHeadings,
        output = '';

    if (!(headings && headings.length)) { return output; }

    headings.forEach(function (h) {
        output += options.fn(h);
    });

    return output;
});
