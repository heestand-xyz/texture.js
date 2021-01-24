# texture.js

[npm package](https://www.npmjs.com/package/texture-js-package)

```html
<canvas id="texture"></canvas>
<script src="https://heestand-xyz.github.io/texture.js/texture.js"></script>
```

```js
var canvas = document.getElementById("texture")
```

[Docs](https://heestand-xyz.github.io/texture.js/docs/)


## Circle

```js
var circleTex = new CircleTEX(canvas)
circleTex.position = new Position(0.0, 0.0)
circleTex.radius = 0.25
```

![CircleTEX](https://heestand-xyz.github.io/texture.js/renders/CircleTEX.jpeg)

Docs for [CircleTEX](https://heestand-xyz.github.io/texture.js/docs/classes/circletex.html)

## Polygon

```js
var polygonTex = new PolygonTEX(canvas)
polygonTex.vertexCount = 3
polygonTex.radius = 1.0 / 3.0
polygonTex.cornerRadius = 0.05
```

![PolygonTEX](https://heestand-xyz.github.io/texture.js/renders/PolygonTEX.jpeg)

Docs for [PolygonTEX](https://heestand-xyz.github.io/texture.js/docs/classes/polygontex.html)

## Noise

```js
var noiseTex = new NoiseTEX(canvas);
noiseTex.octaves = 2
noiseTex.scale = 1.5
```

![NoiseTEX](https://heestand-xyz.github.io/texture.js/renders/NoiseTEX.jpeg)

Docs for [NoiseTEX](https://heestand-xyz.github.io/texture.js/docs/classes/noisetex.html)

## Gradient

```js
var gradientTex = new GradientTEX(canvas);
gradientTex.direction = GradientDirection.vertical
gradientTex.scale = 1.0
gradientTex.colorStops = [
    new GradientColorStop(0.0, Color.black),
    new GradientColorStop(1.0, Color.white)
]
```

![GradientTEX](https://heestand-xyz.github.io/texture.js/renders/GradientTEX.jpeg)

Docs for [GradientTEX](https://heestand-xyz.github.io/texture.js/docs/classes/gradienttex.html)
