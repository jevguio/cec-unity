import { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    const container = document.querySelector("#unity-container");
    const canvas = document.querySelector("#unity-canvas");
    const loadingBar = document.querySelector("#unity-loading-bar");
    const progressBarFull = document.querySelector("#unity-progress-bar-full");
    const fullscreenButton = document.querySelector("#unity-fullscreen-button");
    const warningBanner = document.querySelector("#unity-warning");

    // Function to show banner for warnings and errors
    function unityShowBanner(msg, type) {
      function updateBannerVisibility() {
        warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
      }
      const div = document.createElement('div');
      div.innerHTML = msg;
      warningBanner.appendChild(div);
      if (type === 'error') div.style = 'background: red; padding: 10px;';
      else {
        if (type === 'warning') div.style = 'background: yellow; padding: 10px;';
        setTimeout(() => {
          warningBanner.removeChild(div);
          updateBannerVisibility();
        }, 5000);
      }
      updateBannerVisibility();
    }

    const buildUrl = "Build";
    const loaderUrl = `${buildUrl}/New folder.loader.js`;
    const config = {
      dataUrl: `${buildUrl}/New folder.data.unityweb`,
      frameworkUrl: `${buildUrl}/New folder.framework.js.unityweb`,
      codeUrl: `${buildUrl}/New folder.wasm.unityweb`,
      streamingAssetsUrl: "StreamingAssets",
      companyName: "ART",
      productName: "WebBaseVirtualInteractiveClassroom",
      productVersion: "0.1",
      showBanner: unityShowBanner,
    };

    // Adjust styles for mobile or desktop
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      // Mobile device style
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
      document.getElementsByTagName('head')[0].appendChild(meta);
      container.className = "unity-mobile";
      canvas.className = "unity-mobile";

      // Uncomment to lower canvas resolution on mobile devices
      // config.devicePixelRatio = 1;
    } else {
      // Desktop style
      canvas.style.width = "960px";
      canvas.style.height = "600px";
    }

    loadingBar.style.display = "block";

    const script = document.createElement("script");
    script.src = loaderUrl;
    script.onload = () => {
      createUnityInstance(canvas, config, (progress) => {
        progressBarFull.style.width = `${100 * progress}%`;
      }).then((unityInstance) => {
        loadingBar.style.display = "none";
        fullscreenButton.onclick = () => {
          unityInstance.SetFullscreen(1);
        };
      }).catch((message) => {
        alert(message);
      });
    };

    document.body.appendChild(script);

    // Cleanup script on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div id="unity-container" className="unity-desktop">
      <canvas id="unity-canvas" width={960} height={600} tabIndex="-1"></canvas>
      <div id="unity-loading-bar">
        <div id="unity-logo"></div>
        <div id="unity-progress-bar-empty">
          <div id="unity-progress-bar-full"></div>
        </div>
      </div>
      <div id="unity-warning"></div>
      <div id="unity-footer">
        <div id="unity-webgl-logo"></div>
        <div id="unity-fullscreen-button"></div>
        <div id="unity-build-title">WebBaseVirtualInteractiveClassroom</div>
      </div>
    </div>
  );
}

export default App;
