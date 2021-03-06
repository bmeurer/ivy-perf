import * as domino from 'domino';
import * as fs from 'fs';
import {join} from 'path';
import {getRendererFactory} from './server_renderer_factory';

// Faster server renders w/ Prod mode (dev mode never needed)
(global as any).ngDevMode = false;

// * NOTE :: leave this as require() since this file is built Dynamically from
// webpack
const {AppComponent, renderComponent, DomSanitizerImpl} = require('./dist/server/main');

const MASTER_DOC: any = domino.createDocument('<app-root></app-root>');

function render(): Document {
  const doc: Document = MASTER_DOC.cloneNode(true);
  const rendererFactory = getRendererFactory(doc);
  const sanitizer = new DomSanitizerImpl(doc);
  renderComponent(AppComponent, {rendererFactory, sanitizer});
  return doc;
}

// Do a sanity check on the output.
(function test() {
  console.log(render().documentElement.outerHTML);
})();

// Time X iterations.
console.time('timer');
for (let i = 0; i < 100000; i++) {
  const output = render().documentElement.outerHTML;
}
console.timeEnd('timer');
