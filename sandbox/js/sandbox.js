var gl,
    canvas,
    FOV_MAX = 100.0,
    FOV_MIN = 0.1;

var pMatrix = mat4.create(),
    mvMatrix = mat4.create();

var shaderProgram;
var triangleVertexPositionBuffer;

function initGL(canvas)
{
    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }

    if (!gl) {
        alert("Could not initialize WebGL.");
    }
}

function initShaders()
{
    var fragmentShader = getShader(gl, "shader-fs"),
        vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program)");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute =
        gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.pMatrixUniform =
        gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform =
        gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

function getShader(gl, id) {
    var shaderScript, source, currentChild, shader;

    shaderScript = document.getElementById(id);
    if (!shaderScript) return null;

    source = "";
    currentChild = shaderScript.firstChild;

    while (currentChild) {
        if (currentChild.nodeType == currentChild.TEXT_NODE) {
            source += currentChild.textContent;
        }
        currentChild = currentChild.nextSibling;
    }

    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Unable to compile shaders: " + gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform,
                        false,
                        pMatrix);

    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform,
                        false,
                        mvMatrix);
}

function initBuffers()
{
    triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);

    var vertices = [ 0.0, 1.0, 0.0,
                    -1.0, -1.0, 0.0,
                    1.0, -1.0, 0.0 ]

    gl.bufferData(gl.ARRAY_BUFFER,
                  new Float32Array(vertices),
                  gl.STATIC_DRAW);

    triangleVertexPositionBuffer.itemSize = 3; // 3D
    triangleVertexPositionBuffer.numItems = 3; // # points per triangle
}

function drawScene()
{
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    mat4.identity(mvMatrix);

    mat4.translate(mvMatrix, [-0.0, 0.0, -6.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
                           triangleVertexPositionBuffer.itemSize,
                           gl.FLOAT,
                           false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
}

function init()
{
    canvas = document.getElementById("sandbox");
    initGL(canvas);
    initShaders();
    initBuffers();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    drawScene();
}
