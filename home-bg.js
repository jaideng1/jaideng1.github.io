
let scene, camera, renderer, raycaster;

class Sphere {
    constructor(theta=0, phi=0, radius=5, sphereRadius=0.05, offset={x:0,y:0,z:0}) {
        this.x = Math.cos(phi) * Math.sin(theta) * radius + offset.x;
        this.y = Math.sin(phi) * Math.sin(theta) * radius + offset.y;
        this.z = Math.cos(theta) * radius + offset.z;
        this.spawnRadius = radius;

        this.settings = {
            theta,
            phi,
            from: {theta, phi},
            ogRadius: radius,
        };

        this.offset = offset;

        this.radius = sphereRadius;
        this.object = null;

        this.maxExtension = (Math.random() * radius * 50) + (radius / 2);

        this.createObject();

        Sphere.sphereObject.push(this);
    }
    changeExtension(percent) {
        this.spawnRadius = (this.maxExtension) * percent;
        if (percent == 0) this.spawnRadius = this.settings.ogRadius;
        this.updateXYZ();
        this.updatePosition();
    }
    changeDegrees(theta, phi) {
        this.settings.theta = theta;
        this.settings.phi = phi;
        this.updateXYZ();
    }
    updateXYZ() {
        this.x = Math.cos(this.settings.phi) * Math.sin(this.settings.theta) * this.spawnRadius + this.offset.x;
        this.y = Math.sin(this.settings.phi) * Math.sin(this.settings.theta) * this.spawnRadius + this.offset.y;
        this.z = Math.cos(this.settings.theta) * this.spawnRadius + this.offset.z;
        this.updatePosition();
    }
    updatePosition() {
        this.object.position.set(this.x, this.y, this.z);
    }
    createObject() {
        this.object = new THREE.Mesh(
            new THREE.SphereGeometry(this.radius, 32, 32),
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
            })
        )

        this.object.position.set(this.x, this.y, this.z);

        if (scene != null) scene.add(this.object);
    }

    calculateHue(theta, phi) {
        let hue = (theta / (Math.PI * 2)) * 360;
        let saturation = (phi / (Math.PI * 2)) * 100;
        return {hue,saturation};
    }

    changeColor(hex) {
        this.object.material.color.setHex(hex);
    }

    static spheres = [];
    static sphereObject = [];

    static reversingSphere = false;
    static t = 0;
    static sphereIsReversed = false;

    static reverseSphereEffect() { //Testing...
        if (Sphere.reversingSphere) {
            let a = (Sphere.sphereIsReversed ? 1 : -1);
            let b = (Sphere.sphereIsReversed ? -1 : 1);

            for (let sphere of Sphere.sphereObject) {
                sphere.spawnRadius = sphere.settings.ogRadius - (sphere.settings.ogRadius * 2 * Sphere.t)
                sphere.updateXYZ();
            }

            Sphere.t += 0.01;

            if (Sphere.t > 1) {
                Sphere.reversingSphere = true;
                Sphere.t = 0;
                Sphere.sphereIsReversed = !Sphere.sphereIsReversed;
            }
        }
    }

    static createSpheres(num, offset = {x:-2.5,y:0,z:0}, spawnRadius=1, sphereRadius=0.05) {
        for (let i = 0; i < num; i++) {
            let phi = Math.random() * Math.PI * 2;
            let theta = Math.random() * Math.PI * 2;

            Sphere.spheres.push(new Sphere(
                phi,
                theta,
                spawnRadius,
                sphereRadius,
                offset
            ));
        }
    }

    static hideSpheres() {
        for (let i = 0; i < Sphere.spheres.length; i++) {
            Sphere.spheres[i].object.visible = false;
        }
    }

    static showSpheres() {
        for (let i = 0; i < Sphere.spheres.length; i++) {
            Sphere.spheres[i].object.visible = true;
        }
    }

}

const MultiSphereSettings = {
    offset: {
        x: -2.5,
        y: 0,
        z: 0
    },
    radius: {
        spawn: 1,
        sphere: 0.05
    }
}

function preSetup() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, PAGE_WIDTH / PAGE_HEIGHT, 0.1, 1000 );

    renderer = new THREE.WebGLRenderer();
    renderer.domElement.id = "canvas-bg";
    document.body.appendChild( renderer.domElement );

    renderer.setSize( PAGE_WIDTH, PAGE_HEIGHT );

    raycaster = new THREE.Raycaster();

    onScroll();
}

let objects = {};

function setup() {
    preSetup();

    lastBoundingBox.left = document.getElementById("break-it").getBoundingClientRect().left;

    Sphere.createSpheres(1000, MultiSphereSettings.offset, MultiSphereSettings.radius.spawn, MultiSphereSettings.radius.sphere);
    
    camera.position.z = 5;
    camera.position.y = 0;
    camera.position.x = 0;

    objects["sphere"] = new THREE.Mesh(
        new THREE.SphereGeometry( 1, 32, 32 ),
        new THREE.MeshBasicMaterial( { color: 0xe84f4f } )
    );

    objects["sphere"].position.x = -2;

    objects["wireframe_sphere"] = new THREE.Mesh(
        new THREE.SphereGeometry( 1, 32, 32 ),
        new THREE.MeshBasicMaterial( { wireframe: true, color: 0xe84f4f } )
    );

    // objects["mouse_sphere"] = new THREE.Mesh(
    //     new THREE.SphereGeometry( 0.05, 32, 32 ),
    //     new THREE.MeshBasicMaterial( { wireframe: true, color: 0xffffff } )
    // );

    // scene.add(objects["mouse_sphere"]);

    objects["wireframe_sphere"].position.x = -2;

    for (let obj of Object.keys(objects)) {
        scene.add(objects[obj]);
    }
}

let lastBoundingBox = {top: 230, left: 594, height: 75}; //Just some defaults.

function animate() {
    if (scrl > 9300 && scrl < 13000) {
        Sphere.showSpheres();
    } else if (scrl >= 11300) {
        Sphere.hideSpheres();
    } else if (scrl < 9300) {
        Sphere.hideSpheres();
    }

    objects["sphere"].visible = false;
    objects["wireframe_sphere"].visible = false;

    let thetaAdjust = ((scrl - 9300) / 1000);

    let spinPhi = 0;
    let spinTheta = 0;

    let negative = false;
    let negativeX = false;

    if (grabbingInsideCircleArea) {
        let distance = distance3D(mouse.intersect.x, mouse.intersect.y, mouse.intersect.z, mouse.lastIntersect.x, mouse.lastIntersect.y, mouse.lastIntersect.z);
        let distancePercentage = distance / (2 * Math.PI * 5);
        let phi = Math.PI * 2 * distancePercentage;
        let theta = Math.PI * 2 * distancePercentage;

        negative = mouse.intersect.y < mouse.lastIntersect.y;
        negativeX = mouse.intersect.x < mouse.lastIntersect.x;
        
        spinPhi = phi * 2;
        spinTheta = theta * 2;
    }

    let extension = 0;

    if (scrl > 10300 && scrl < 11300) {
        extension = Math.sin(Math.PI * ((scrl - 10300) / 1000));
    }

    if (scrl > 10300 && scrl < 12000) {
        if (lastBoundingBox != null) {
            document.getElementById("break-it").style.position = "fixed";
            let percent = (scrl - 11500) / 500;
            document.getElementById("break-it").style.top = (lastBoundingBox.top - (scrl > 11500 ? (lastBoundingBox.top + lastBoundingBox.height) * percent : 0)) + "px";
            document.getElementById("break-it").style.left = (lastBoundingBox.left) + "px";
        }
    } else {
        document.getElementById("break-it").style.position = "unset";
        lastBoundingBox.left = document.getElementById("break-it").getBoundingClientRect().left;
    }

    document.getElementById("after-break").style.top = (12500 - scrl) + "px";

    for (let sphere of Sphere.spheres) {
        sphere.changeDegrees(
            sphere.settings.from.theta + thetaAdjust,
            sphere.settings.phi + (grabbingInsideCircleArea ? 0 : 0.003)
        );

        if (extension > 0) sphere.changeExtension(extension);
        else sphere.changeExtension(0);

        if (grabbingInsideCircleArea) sphere.changeDegrees(sphere.settings.theta, sphere.settings.phi + (negative ? -spinPhi : spinPhi));

        let {hue} = sphere.calculateHue(sphere.settings.theta, sphere.settings.phi);
        hue = hue / 360;
        let saturation = 1;
        let value = 1;
        let rgb = toRGB(hue, saturation, value);
        let binary = hexToBinary(rgbToHex(rgb.r, rgb.g, rgb.b));
        sphere.changeColor(binary);
    }

    if (Sphere.reversingSphere) Sphere.reverseSphereEffect();

    renderer.render( scene, camera );
}

let frame = 0;

setup();
setInterval(() => {
    frame++;
    requestAnimationFrame(animate);
}, 1000 / 60);


function toRad(degrees) {
    return degrees * Math.PI / 180;
}

//Source: https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
function toRGB(h,s,v) {
    let r = 0, g = 0, b = 0;
    let i = Math.floor(h * 6);
    let f = h * 6 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
        default:
            break;
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

//From: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

//https://stackoverflow.com/questions/10288445/how-to-get-hex-integer-from-a-string-in-js
function hexToBinary(hex) {
    return parseInt(hex.replace(/^#/, ''), 16);
}

function distance3D(x,y,z,x2,y2,z2) {
    return Math.sqrt(Math.pow(x-x2,2) + Math.pow(y-y2,2) + Math.pow(z-z2,2));
}

function insideSphere(x, y, z, sphereX, sphereY, sphereZ, radius) {
    let distance = distance3D(x,y,z,sphereX,sphereY,sphereZ);
    return distance < radius;
}

let mouse = {
    x: 0,
    y: 0,
    intersect: new THREE.Vector3(),
    lastIntersect: new THREE.Vector3(),
}

let insideCircleGrabArea = false;
let grabbingInsideCircleArea = false;

function onMouseMove(e) {
    mouse.x = (e.clientX / PAGE_WIDTH) * 2 - 1;
    mouse.y = -(e.clientY / PAGE_HEIGHT) * 2 + 1;
    
    mouse.lastIntersect = mouse.intersect.clone();

    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,0,1), 0), mouse.intersect);
    
    objects["wireframe_sphere"].lookAt(mouse.intersect);
    objects["sphere"].lookAt(mouse.intersect);

    if (insideSphere(mouse.intersect.x, mouse.intersect.y, MultiSphereSettings.offset.z, MultiSphereSettings.offset.x, MultiSphereSettings.offset.y, MultiSphereSettings.offset.z, MultiSphereSettings.radius.spawn)) {
        document.getElementById("canvas-bg").style.cursor = "grab";
        document.body.style.cursor = "grab";
        document.getElementById("content").style.userSelect = "none";
        insideCircleGrabArea = true;
    } else {
        document.getElementById("canvas-bg").style.cursor = "auto";
        document.body.style.cursor = "auto";
        document.getElementById("content").style.userSelect = "auto";
        insideCircleGrabArea = false;
        grabbingInsideCircleArea = false;
    }

    // objects["mouse_sphere"].position.x = mouse.intersect.x;
    // objects["mouse_sphere"].position.y = mouse.intersect.y;
}

document.addEventListener("mousemove", onMouseMove);

document.addEventListener("mousedown", (e) => {
    if (insideCircleGrabArea) {
        document.getElementById("canvas-bg").style.cursor = "grabbing";
        document.body.style.cursor = "grabbing";
        grabbingInsideCircleArea = true;
    }
});

document.addEventListener("mouseup", (e) => {
    if (insideCircleGrabArea) {
        document.getElementById("canvas-bg").style.cursor = "grab";
        document.body.style.cursor = "grab";
        grabbingInsideCircleArea = false;
    }
});

function lerp(a, b, t) {
    return a + (b - a) * t;
}