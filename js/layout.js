/* @license
 * Jacob Perez <https://jacobxperez.github.io/vannelli/>
 * Copyright (C) 2022 Jacob Perez <jacobxperez@gmx.com>
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
-----------------------------------------------------------------------------*/
import {aside} from './partials/aside';
import {Template} from './modules/template';

const page = new Template();

let title;
meta.title === null
    ? (title = `<h1>Jacob Perez</h1>`)
    : (title = `<h1>${meta.title}</h1>`);

let subtitle;
meta.subtitle === null
    ? (subtitle = '')
    : (subtitle = `<h2 data-text="h5">${meta.subtitle}</h2>`);

// page header
page.header = `
    <div id="header" data-wrapper="fit">
        ${title}
        ${subtitle}
    </div>`;

// check for layout type
if (meta.layout === null) {
    page.main = `
    <div data-wrapper="fit" data-grid="main">
        <aside id="aside">${aside}</aside>
        <article id="content"></article>
    </div>`;
} else if (meta.layout === 'post') {
    page.main = `
    <div data-wrapper="fit" data-grid="main">
        <aside id="aside"></aside>
        <article id="content"></article>
    </div>`;
} else if (meta.layout === 'full') {
    page.main = `
    <div id="content" data-wrapper="fit" data-grid="main">
    </div>`;
}

// check and sets template url for localhost or for public url
let templateURL;
location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    ? (templateURL = window.location.origin + '/templates/index.2a86ff1c.html')
    : (templateURL =
          window.location.origin + '/blog/templates/index.6e7a5d68.html');

// create main layout
page.layout = `
    <nav data-navbar="top">
        <div id="nav"></div>
    </nav>
    <header data-section="header">
        ${page.header}
    </header>
    <main data-section="main">
        ${page.main}
    </main>
    <footer data-section="footer">
        <div id="footer" data-wrapper="fit">
        </div>
    </footer>`;

// parse everything together
page.fromString(page.layout, 'root')
    .getTemplate('asideTemplate', 'aside')
    .getTemplate('contentTemplate', 'content')
    .fetchTemplate(templateURL, 'nav', toggle)
    .fetchTemplate(templateURL, 'footer');