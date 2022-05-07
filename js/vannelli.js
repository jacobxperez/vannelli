/* Jacob Perez <https://jacobxperez.github.io/vannelli/>
 * Copyright (C) 2022 Jacob Perez <jacobxperez@gmx.com>
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
-----------------------------------------------------------------------------*/
// Check if site is on local host
location.hostname === "localhost" || location.hostname === "127.0.0.1" ?
    baseURL = window.location.origin : baseURL = window.location.origin + '/vannelli';

// Initialize the DOM Parser
var parser = new DOMParser();

// Document Data
var docData = {
    title: document.title,
    subTitle: null,
    // author: document.querySelector('[name=author]').content,
};

const template = {
    _copyPasteTemplate(templateID, targetID, _source) {
        // get template ID from source
        const _getTemplateID = _source.getElementById(templateID);
        // clone template ID from source
        const _cloneTemplate = _getTemplateID.content.cloneNode(true);
        // append template to target selector
        const _targetID = document.getElementById(targetID);
        _targetID.appendChild(_cloneTemplate);
        // delete original template from document
        _getTemplateID.remove();
    },
    _parseSource(source, templateID, targetID, mimeType) {
        if (mimeType === undefined) {
            mimeType = 'text/html'
        }
        // get source and parse it
        const _source = parser.parseFromString(source, mimeType);
        this._copyPasteTemplate(templateID, targetID, _source);
    },
    getTemplate(templateID, targetID, _source = document) {
        new Promise((resolve, reject) => {
                // check if template exist
                templateID !== null ? resolve() : reject();
            })
            .then(() => this._copyPasteTemplate(templateID, targetID, _source))
            .catch(err => console.error(err))

        return this;
    },
    fromString(source, templateID, targetID, mimeType) {
        new Promise((resolve, reject) => {
                // check if source is string
                typeof source === 'string' ?
                    resolve() : reject(err = 'Error: Template source is not a String');
            })
            .then(() => this._parseSource(source, templateID, targetID, mimeType))
            .catch(err => console.error(err))

        return this;
    },
    fetchSource(source, templateID, targetID, mimeType) {
        fetch(baseURL + source)
            // when the source is loaded convert to text
            .then(response => response.text())
            .then(text => this._parseSource(text, templateID, targetID, mimeType))
            .catch(err => console.error(err))
            .finally(() => {
                // add code
            })

        return this;
    },
};

document.addEventListener("DOMContentLoaded", () => {
    // Check for subtitle then added to layout
    docData.subTitle === null ?
        subTitle = '' :
        subTitle = `<h2 data-text="h5">${docData.subTitle}</h2>`;

    // 1. generate page layout from string
    // 2. move secondary content to layout
    // 3. move page content to layout
    // 4. fetch navigation
    // 5. fetch footer
    const layout = template.fromString(`
    <template id="layoutTemplate">
        <header id="header" data-section="header">
            <div id="headerContent" data-container="fit">
                <h1>${docData.title}</h1>
                ${subTitle}
            </div>
        </header>

        <main id="main" data-section="main">
            <div id="content" data-container="fit" data-grid="main">
            </div>
        </main>

        <footer id="footer" data-section="footer">
            <div id="footerContent" data-container="fit">
            </div>
        </footer>
    </template>
    `, 'layoutTemplate', 'root')
        .getTemplate('asideTemplate', 'content')
        .getTemplate('contentTemplate', 'content')
        .fetchSource('/templates/main-min.html', 'navTemplate', 'header')
        .fetchSource('/templates/main-min.html', 'footerTemplate', 'footerContent');
    // always leave footer at the end for toggles to work
});