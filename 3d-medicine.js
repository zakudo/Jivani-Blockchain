// ==========================================
// MEDCHAIN REALISTIC 3D MODEL & SHADER SCRIPT
// ==========================================

(function () {
    const threeScript = document.createElement("script");
    threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";

    threeScript.onload = function () {
        initMedChain3D();
    };

    document.head.appendChild(threeScript);

    function initMedChain3D() {
        const hero = document.querySelector(".hero");

        if (!hero) return;

        const container = document.createElement("div");
        container.id = "medchain-3d";
        
        hero.style.position = "relative";
        hero.appendChild(container);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            40,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0.2, 8.5);

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.3;

        container.appendChild(renderer.domElement);

        // LIGHTS
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
        keyLight.position.set(5, 8, 5);
        scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0xd0e7ff, 1.0);
        fillLight.position.set(-5, 2, -2);
        scene.add(fillLight);

        // DYNAMIC HIGH-CONTRAST QR TEXTURE
        function createLabelTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 2048;
            canvas.height = 1024;
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, 2048, 1024);

            ctx.fillStyle = "#0c4a34";
            ctx.fillRect(0, 0, 2048, 180);

            ctx.fillStyle = "#ffffff";
            ctx.font = "900 70px Arial, sans-serif";
            ctx.fillText("MEDCHAIN VERIFIED", 80, 115);

            ctx.fillStyle = "#35c98a";
            ctx.font = "bold 45px Arial, sans-serif";
            ctx.fillText("BLOCKCHAIN ANTI-COUNTERFEIT", 1250, 115);

            ctx.fillStyle = "#000000";
            ctx.font = "900 65px Arial, sans-serif";
            ctx.fillText("PARACETAMOL 500mg", 80, 310);

            ctx.fillStyle = "#111111";
            ctx.font = "bold 45px Arial, sans-serif";
            ctx.fillText("Batch ID: #MC-2026-X889", 80, 410);
            ctx.fillText("Mfg: 09/2026  |  Exp: 09/2028", 80, 480);
            ctx.fillText("Auth: On-Chain Immutable", 80, 550);

            ctx.fillStyle = "#000000";
            for (let i = 0; i < 45; i++) {
                let w = (i % 3 === 0) ? 14 : 6;
                ctx.fillRect(80 + (i * 20), 650, w, 140);
            }

            ctx.fillStyle = "#f2fcf7";
            ctx.fillRect(1280, 250, 680, 680);
            ctx.strokeStyle = "#0c4a34";
            ctx.lineWidth = 12;
            ctx.strokeRect(1280, 250, 680, 680);

            const qX = 1360, qY = 320, qSize = 520;
            const cells = 21;
            const cSize = qSize / cells;

            ctx.fillStyle = "#ffffff";
            ctx.fillRect(qX, qY, qSize, qSize);

            ctx.fillStyle = "#000000";
            for (let r = 0; r < cells; r++) {
                for (let c = 0; c < cells; c++) {
                    let isTopLeft = (r < 7 && c < 7);
                    let isTopRight = (r < 7 && c >= cells - 7);
                    let isBottomLeft = (r >= cells - 7 && c < 7);

                    if (isTopLeft || isTopRight || isBottomLeft) {
                        if ((r === 0 || r === 6 || c === 0 || c === 6) ||
                            (r >= 2 && r <= 4 && c >= 2 && c <= 4) ||
                            (r === 0 || r === 6 || c === cells - 7 || c === cells - 1) ||
                            (r >= 2 && r <= 4 && c >= cells - 5 && c >= cells - 3) ||
                            (r === cells - 7 || r === cells - 1 || c === 0 || c === 6) ||
                            (r >= cells - 5 && r <= cells - 3 && c >= 2 && c <= 4)) {
                            ctx.fillRect(qX + c * cSize, qY + r * cSize, cSize, cSize);
                        }
                    } else if (Math.random() > 0.42) {
                        ctx.fillRect(qX + c * cSize, qY + r * cSize, cSize, cSize);
                    }
                }
            }

            ctx.fillStyle = "#0c4a34";
            ctx.font = "900 42px Arial, sans-serif";
            ctx.fillText("SCAN TO VERIFY", 1450, 880);

            return new THREE.CanvasTexture(canvas);
        }

        // BOTTLE GROUP
        const bottle = new THREE.Group();

        const bottleMaterial = new THREE.MeshStandardMaterial({ color: 0xf4f7f6, roughness: 0.18, metalness: 0.05 });
        const darkGreenMaterial = new THREE.MeshStandardMaterial({ color: 0x0c4a34, roughness: 0.35, metalness: 0.15 });

        const bodyGeo = new THREE.CylinderGeometry(1.1, 1.1, 2.0, 64);
        const bottleBody = new THREE.Mesh(bodyGeo, bottleMaterial);
        bottleBody.position.y = -0.2;
        bottle.add(bottleBody);

        const shoulderGeo = new THREE.CylinderGeometry(0.85, 1.1, 0.35, 64);
        const shoulder = new THREE.Mesh(shoulderGeo, bottleMaterial);
        shoulder.position.y = 0.975;
        bottle.add(shoulder);

        const baseGeo = new THREE.CylinderGeometry(1.05, 1.1, 0.1, 64);
        const base = new THREE.Mesh(baseGeo, bottleMaterial);
        base.position.y = -1.25;
        bottle.add(base);

        const neckGeo = new THREE.CylinderGeometry(0.78, 0.78, 0.35, 48);
        const neck = new THREE.Mesh(neckGeo, bottleMaterial);
        neck.position.y = 1.28;
        bottle.add(neck);

        const ringGeo = new THREE.TorusGeometry(0.79, 0.03, 16, 48);
        const ring = new THREE.Mesh(ringGeo, bottleMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 1.25;
        bottle.add(ring);

        // CAP
        const capGroup = new THREE.Group();
        const mainCapGeo = new THREE.CylinderGeometry(0.88, 0.88, 0.45, 64);
        const mainCap = new THREE.Mesh(mainCapGeo, darkGreenMaterial);
        capGroup.add(mainCap);

        const capLipGeo = new THREE.CylinderGeometry(0.91, 0.88, 0.08, 64);
        const capLip = new THREE.Mesh(capLipGeo, darkGreenMaterial);
        capLip.position.y = 0.22;
        capGroup.add(capLip);

        const ridgeCount = 36;
        const ridgeGeo = new THREE.BoxGeometry(0.02, 0.42, 0.03);
        for (let i = 0; i < ridgeCount; i++) {
            const angle = (i / ridgeCount) * Math.PI * 2;
            const ridge = new THREE.Mesh(ridgeGeo, darkGreenMaterial);
            ridge.position.set(Math.cos(angle) * 0.88, 0, Math.sin(angle) * 0.88);
            ridge.rotation.y = -angle;
            capGroup.add(ridge);
        }

        capGroup.position.y = 1.58;
        bottle.add(capGroup);

        // LABEL
        const labelTexture = createLabelTexture();
        labelTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

        const labelGeometry = new THREE.CylinderGeometry(1.11, 1.11, 1.5, 64, 1, true, -Math.PI / 1.4, Math.PI * 1.5);
        const labelMaterial = new THREE.MeshBasicMaterial({ map: labelTexture, side: THREE.DoubleSide });
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.y = -0.15;
        bottle.add(label);

        bottle.position.y = -0.2;
        scene.add(bottle);

        // CAPSULES
        function createCapsule() {
            const group = new THREE.Group();
            const mat1 = new THREE.MeshStandardMaterial({ color: 0x35c98a, roughness: 0.2 });
            const mat2 = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });

            const tG = new THREE.CylinderGeometry(0.14, 0.14, 0.2, 32);
            const tM = new THREE.Mesh(tG, mat1);
            tM.position.y = 0.1;

            const tDG = new THREE.SphereGeometry(0.14, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
            const tD = new THREE.Mesh(tDG, mat1);
            tD.position.y = 0.2;

            const bM = new THREE.Mesh(tG, mat2);
            bM.position.y = -0.1;

            const bD = new THREE.Mesh(tDG, mat2);
            bD.rotation.x = Math.PI;
            bD.position.y = -0.2;

            group.add(tM, tD, bM, bD);
            return group;
        }

        const capsules = [];
        const capsulePositions = [
            [-2.2,  1.4,  0.5], [ 2.3,  1.2, -0.4],
            [-2.5, -0.8,  0.2], [ 2.4, -1.0,  0.6],
            [-1.2,  2.2, -0.8], [ 1.3, -2.1,  0.1],
            [-2.8,  0.2, -0.5], [ 2.7,  0.3,  0.4]
        ];

        capsulePositions.forEach(function (pos, index) {
            const c = createCapsule();
            c.position.set(pos[0], pos[1], pos[2]);
            c.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            scene.add(c);

            capsules.push({
                mesh: c,
                speed: 0.25 + Math.random() * 0.35,
                rotSpeedX: 0.005 + Math.random() * 0.008,
                rotSpeedY: 0.005 + Math.random() * 0.008,
                offset: index * 0.8
            });
        });

        // PARALLAX
        let mouseX = 0, mouseY = 0;
        document.addEventListener("mousemove", (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
        });

        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            const time = clock.getElapsedTime();

            bottle.rotation.y = time * 0.2 + mouseX * 0.5;
            bottle.rotation.x = mouseY * 0.2;
            bottle.position.y = -0.2 + Math.sin(time * 1.5) * 0.04;

            capsules.forEach((item) => {
                item.mesh.rotation.x += item.rotSpeedX;
                item.mesh.rotation.y += item.rotSpeedY;
                item.mesh.position.y += Math.sin(time * item.speed + item.offset) * 0.0025;
            });

            camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
            camera.position.y += (-mouseY * 0.5 + 0.2 - camera.position.y) * 0.05;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        }

        animate();

        window.addEventListener("resize", () => {
            if (!container) return;
            const w = container.clientWidth, h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        });
    }
})();