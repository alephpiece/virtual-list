# rc-virtual-list

React Virtual List Component which worked with animation.

[![NPM version][npm-image]][npm-url] [![dumi](https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square)](https://github.com/umijs/dumi) [![build status][github-actions-image]][github-actions-url] [![Test coverage][coveralls-image]][coveralls-url] [![node version][node-image]][node-url] [![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/@alephpiece/rc-virtual-list.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@alephpiece/rc-virtual-list
[github-actions-image]: https://github.com/alephpiece/virtual-list/workflows/test/badge.svg
[github-actions-url]: https://github.com/alephpiece/virtual-list/actions
[coveralls-image]: https://img.shields.io/codecov/c/github/alephpiece/virtual-list/master.svg?style=flat-square
[coveralls-url]: https://codecov.io/gh/alephpiece/virtual-list
[node-image]: https://img.shields.io/badge/node.js-%3E=_6.0-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/@alephpiece/rc-virtual-list.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/@alephpiece/rc-virtual-list

## Online Preview

https://rc-virtual-list.vercel.app/

## Development

```bash
npm install
npm start
open http://localhost:8000/
```

## Feature

- Support react.js
- Support animation
- Support IE11+

## Install

[![rc-virtual-list](https://nodei.co/npm/@alephpiece/rc-virtual-list.png)](https://www.npmjs.com/package/@alephpiece/rc-virtual-list)

## Usage

```js
// import List from 'rc-virtual-list';
import List from '@alephpiece/rc-virtual-list';

<List data={[0, 1, 2]} height={200} itemHeight={30} itemKey="id">
  {index => <div>{index}</div>}
</List>;
```

# API

## List

| Prop       | Description                                             | Type                                                                                                                                                                                  | Default |
| ---------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| children   | Render props of item                                    | (item, index, props) => ReactElement                                                                                                                                                  | -       |
| component  | Customize List dom element                              | string \| Component                                                                                                                                                                   | div     |
| data       | Data list                                               | Array                                                                                                                                                                                 | -       |
| disabled   | Disable scroll check. Usually used on animation control | boolean                                                                                                                                                                               | false   |
| height     | List height                                             | number                                                                                                                                                                                | -       |
| itemHeight | Item minimum height                                     | number                                                                                                                                                                                | -       |
| itemKey    | Match key with item                                     | string                                                                                                                                                                                | -       |
| overscan   | Overscan count                                          | number                                                                                                                                                                                | 1       |
| smoothScroll | Enable smooth virtual scrolling                       | boolean \| { stepRatio?: number }                                                                                                                                                     | false   |
| styles     | style                                                   | { horizontalScrollBar?: React.CSSProperties; horizontalScrollBarThumb?: React.CSSProperties; verticalScrollBar?: React.CSSProperties; verticalScrollBarThumb?: React.CSSProperties; } | -       |

`children` provides additional `props` argument to support IE 11 scroll shaking.
It will set `style` to `visibility: hidden` when measuring. You can ignore this if no requirement on IE.
