# texture.js

```html
<canvas id="texture"></canvas>
<script src="https://heestand-xyz.github.io/texture.js/texture.js"></script>
```

```js
var canvas = document.getElementById("texture")
```

## Circle

```js
var circleTex = new CircleTEX(canvas)
polygonTex.radius = 0.25
```

![CircleTEX](https://heestand-xyz.github.io/texture.js/renders/CircleTEX.jpeg)

## Polygon

```js
var polygonTex = new PolygonTEX(canvas)
polygonTex.radius = 1.0 / 3.0
polygonTex.cornerRadius = 0.05
```

![PolygonTEX](https://heestand-xyz.github.io/texture.js/renders/PolygonTEX.jpeg)

## Noise

```js
var noiseTex = new NoiseTEX(canvas);
noiseTex.octaves = 2
noiseTex.scale = 1.5
```

![NoiseTEX](https://heestand-xyz.github.io/texture.js/renders/NoiseTEX.jpeg)

