import "../app/globals.css";
import { AppProps } from "next/app";
import { ShaderGradientCanvas, ShaderGradient } from "shadergradient";
import Provider from "@/components/provider";
import { motion } from "framer-motion";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <div className="relative min-h-screen overflow-hidden">
          {/* Shader background with smooth fade-in */}
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <ShaderGradientCanvas>
              <ShaderGradient
                control="query"
                urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.2&cAzimuthAngle=180&cDistance=3.6&cPolarAngle=90&cameraZoom=2&color1=%23ff5005&color2=%23dbba95&color3=%23d0bce1&destination=onCanvas&embedMode=off&envPreset=lobby&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=env&pixelDensity=1&positionX=-1.4&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=10&rotationZ=50&shader=defaults&type=plane&uDensity=1.3&uFrequency=5.5&uSpeed=0.4&uStrength=4&uTime=0&wireframe=false"
              />
            </ShaderGradientCanvas>
          </motion.div>

          {/* Main content */}
          <div className="relative z-10">
            <Component {...pageProps} />
          </div>
        </div>
      </motion.div>
    </Provider>
  );
}

export default MyApp;
