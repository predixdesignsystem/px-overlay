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
/* Common imports */
/* Common demo imports */
/* Imports for this component */
/* Demo DOM module */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import 'px-demo/px-demo-header.js';
import 'px-demo/px-demo-api-viewer.js';
import 'px-demo/px-demo-footer.js';
import 'px-demo/px-demo-configs.js';
import 'px-demo/px-demo-props.js';
import 'px-demo/px-demo-interactive.js';
import 'px-demo/px-demo-component-snippet.js';
import 'px-dropdown/px-dropdown.js';
import 'px-modal/px-modal.js';
import 'px-modal/px-modal-trigger.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <!-- Header -->
    <px-demo-header module-name="px-overlay-content &amp; px-overlay-container" parent-name="px-overlay" description="The px-overlay components are used for modal dialogues, popovers, and other use cases where content floats above other content. It prevents stacking context issues by hoisting the floating dialog up the dom to a container." mobile="" tablet="" desktop="">
    </px-demo-header>

    <!-- Interactive -->
    <px-demo-interactive>
      <!-- Configs -->
      <px-demo-configs slot="px-demo-configs" configs="[[configs]]" props="{{props}}" chosen-config="{{chosenConfig}}"></px-demo-configs>

      <!-- Props -->
      <px-demo-props slot="px-demo-props" props="{{props}}" config="[[chosenConfig]]"></px-demo-props>

      <!-- Component ---------------------------------------------------------->
      <px-demo-component slot="px-demo-component">
        <div>
          <p>This demo illustrates a stacking context problem. We have a px-dropdown (which uses px-overlay-content internally) slotted inside a px-modal. You can toggle the \`hoist\` property in the properties panel to see the difference between hoisting the dropdown and not.</p>

          <p>See <a href="https://www.predix-ui.com/#/develop/stacking-context">this stacking context guide</a> for a thorough description of how to use the \`px-overlay-content\` and \`px-overlay-container\` components.</p>

          <px-modal id="modal" header-text="This is a modal" accept-text="Accept" reject-text="Reject" open-trigger="[[openTrigger]]">
            <div slot="body" style="padding:20px;">
              <p>Click on the dropdown to see it float over the modal (if hoist is on), or be cut off by the modal (if hoist is off).</p>
              <px-dropdown id="dropdown" hoist="{{props.hoist.value}}" container-type="{{props.containerType.value}}" items="[{&quot;key&quot;:&quot;1&quot;,&quot;val&quot;:&quot;iPhone&quot;},{&quot;key&quot;:&quot;2&quot;,&quot;val&quot;:&quot;Android&quot;},{&quot;key&quot;:&quot;3&quot;,&quot;val&quot;:&quot;Blackberry&quot;},{&quot;key&quot;:&quot;4&quot;,&quot;val&quot;:&quot;I am a menu item so I cannot be selected&quot;,&quot;disableSelect&quot;:true},{&quot;key&quot;:&quot;5&quot;,&quot;val&quot;:&quot;Flip Phone&quot;,&quot;disabled&quot;:true}]">
              </px-dropdown>
            </div>
          </px-modal>
          <px-modal-trigger id="modalTrigger" trigger="{{openTrigger}}">
            <button class="btn">Open Modal</button>
          </px-modal-trigger>
        </div>
      </px-demo-component>
      <!-- END Component ------------------------------------------------------>

      <px-demo-component-snippet slot="px-demo-component-snippet" element-properties="{{props}}" element-name="px-overlay-content">
      </px-demo-component-snippet>
    </px-demo-interactive>

    <!-- API Viewer -->
    <!-- <px-demo-api-viewer source="px-overlay"></px-demo-api-viewer> -->

    <!-- Footer -->
    <px-demo-footer></px-demo-footer>
`,

  is: 'px-overlay-demo',

  properties: {

    props: {
      type: Object,
      value: function(){ return this.demoProps; }
    },

    configs: {
      type: Array,
      value: function(){
        return [{
          configName: "Default",
          configReset: true
        }]
      }
    }
  },

  demoProps: {
    hoist: {
      type: Boolean,
      defaultValue: true,
      inputType: 'toggle'
    },
    containerType: {
      type: String,
      defaultValue: "foo",
      inputType: 'text'
    },
    eventNames: {
      type: Array,
      defaultValue: [
        "px-dropdown-click",
        "px-dropdown-selection-changed"
      ],
      inputType: 'code:JSON'
    },
  }
});
