/* Jacob Perez <https://jacobxperez.github.io/vannelli/>
 * Copyright (C) 2022 Jacob Perez <jacobxperez@gmx.com>
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
-----------------------------------------------------------------------------*/
// Check if site is on local host
location.hostname === "localhost" || location.hostname === "127.0.0.1" ?
    baseURL = window.location.origin : baseURL = window.location.origin + '/vannelli';

// Document Data
var docData = {
    title: document.title,
    subTitle: null,
    // author: document.querySelector('[name=author]').content,
};

const template = {
    parser: new DOMParser(),
    _copyPasteTemplate(templateID, targetID, _source) {
        // get template ID from source
        const _getTemplateID = _source.getElementById(templateID);
        // clone template ID from source
        const _cloneTemplate = _getTemplateID.content.cloneNode(true);
        // get target ID from page
        const _targetID = document.getElementById(targetID);
        // append template to target ID
        _targetID.appendChild(_cloneTemplate);
        // delete original template from document
        _getTemplateID.remove();
    },
    _parseSource(source, templateID, targetID, mimeType) {
        if (mimeType === undefined) mimeType = 'text/html';
        // get source and parse it
        const _source = this.parser.parseFromString(source, mimeType);
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
                    resolve() : reject(err = 'Error: Source is not a String');
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
                // once the footer is loaded start toggles
                if (templateID === 'footerTemplate') toggle();
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
        <header id="header">
            <h1>${docData.title}</h1>
            ${subTitle}
        </header>

        <main id="main">
        </main>

        <footer id="footer">
        </footer>
    </template>
        `, 'layoutTemplate', 'root')
        .getTemplate('asideTemplate', 'content')
        .getTemplate('contentTemplate', 'content')
        .fetchSource('/templates/main-min.html', 'navTemplate', 'header')
        .fetchSource('/templates/main-min.html', 'footerTemplate', 'footerContent');
    // always leave footer at the end for toggles to work
});
