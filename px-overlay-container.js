/*
Copyright (c) 2018, General Electric

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/**
Bits of this are inspired & pseudo copied from https://github.com/PolymerLabs/iron-overlay

Their license:
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
/**
A container to which content from px-overlay-content is hoisted. This is done to escape out of stacking contexts so overlays / modals / floating content can be shown over other content.

### Usage

#### Generic
```
    <px-overlay-container></px-overlay-container>
```

#### For content with matching type
```
    <px-overlay-container container-type="foo"></px-overlay-container>
```

### Styling

The following custom properties are available for styling of the overlay container.

Custom property | Description
:----------------|:-------------
`--px-overlay-container-z-index` | The z-index of the container

@element px-overlay-container
@blurb A container to which content from px-overlay-content is hoisted.
@homepage index.html
@demo index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import './px-overlay-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: html`
    <style>
      #overlayHost {
        position: relative;
        z-index: var(--px-overlay-container-z-index, 1250);
      }
    </style>
    <div id="overlayHost">
    </div>
`,

  is: 'px-overlay-container',

  behaviors: [
    PxOverlayBehavior.sharedProperties
  ],

  properties: {
    _overlayHost: HTMLElement,
    _parent: HTMLElement,
    _attachedOverlays: Map
  },

  created: function() {
    this._attachmentRequestBound = this._attachmentRequest.bind(this);
    this._attachedOverlays = new Map();
  },

  ready: function() {
    this._overlayHost = this.shadowRoot ? this.shadowRoot.querySelector('#overlayHost') : this.querySelector('#overlayHost');

  },

  attached: function() {
    // we want to get the parent element of this container so we can attach a listener
    // to it and pick up events from sibling elems instead of having to wrap everything
    // in overlay-container.
    this._parent = this._getHostRoot();
    this._parent.addEventListener('px-overlay-attachment-request', this._attachmentRequestBound);

  },

  detached: function() {
    this._parent.removeEventListener('px-overlay-attachment-request', this._attachmentRequestBound);
    this._parent = null;

    this._attachedOverlays.forEach(function(val, key, map) {
      val.content.forEach(function(child) {
        val.localContainer.removeChild(child);
      });

      key.eventNames.forEach(function(eventName) {
        val.localContainer.removeEventListener(eventName, val.fn);
      });

      key._container = undefined;
      key.hoistOverlay();
    });

    this._attachedOverlays.clear();
  },

  _attachmentRequest: function(evt) {
    var ne = dom(evt);
    var target = ne.rootTarget;

    if(target.containerType !== this.containerType) {
      return;
    }

    // Create a container for our content
    // We need this to attach listeners to so they dont get
    // trampled by other events with the same name
    var elem = document.createElement('div');

    // set up listeners to refire events
    var refireCB = this._refireEvent.bind(this, target);
    target.eventNames.forEach(function(name) {
      elem.addEventListener(name, refireCB);
    });

    // Store references to our overlay target, content, and local container
    // This way we can handle detachment more easily
    var targetData = {
      content: [],
      localContainer: elem,
      fn: refireCB
    };

    this._attachedOverlays.set(target, targetData);

    // store and attach content
    target._content.forEach(function(child) {
      this._attachedOverlays.get(target).content.push(child);
      elem.appendChild(child);
    }.bind(this));

    // tell the source overlay who we are for future detachment
    target._container = this;

    this._overlayHost.appendChild(elem);

    evt.preventDefault();
    evt.stopPropagation();
  },

  appendNewContent: function(target, content) {
    if(!this._attachedOverlays.has(target)) {
      console.warn('Overlay container and container have become desynced. Cant add new content.');
      return;
    }

    var data = this._attachedOverlays.get(target);

    content.forEach(function(child) {
      data.content.push(child);
      data.localContainer.appendChild(child);
    });
  },

  detachContent: function(target) {
    if(!this._attachedOverlays.has(target)) {
      console.warn('something has gone terribly wrong... overlay and container have become desynced.');
      return;
    }

    var info = this._attachedOverlays.get(target);

    info.content.forEach(function(child) {
      info.localContainer.removeChild(child);
    });

    target.eventNames.forEach(function(eventName) {
      info.localContainer.removeEventListener(eventName, info.fn);
    });

    this._overlayHost.removeChild(info.localContainer);

    this._attachedOverlays.delete(target);

  },

  /**
  * Returns the root element hosting the container.
  * @returns {Node}
  */
  _getHostRoot: function() {
    var n = this;
    while (n) {
      if (n.nodeType === Node.DOCUMENT_FRAGMENT_NODE && n.host) {
        return n;
      }
      n = n.parentNode;
    }
    return document;
  },

  _refireEvent: function(target, evt) {
    evt.preventDefault();
    evt.stopPropagation();

    var newEvent = new CustomEvent(evt.type, evt);

    // save previous event data in case it is needed
    newEvent.sourceEvent = evt;

    target.dispatchEvent(newEvent);

  },

  removeElem: function(overlay, elem) {
    var content = this._attachedOverlays.get(overlay);

    var i = content.content.indexOf(elem);

    if(i === -1) {
      console.warn('Container could not locate content to remove...');
      return;
    }

    content.content.splice(i,1);
    content.localContainer.removeChild(elem);
  }
});
