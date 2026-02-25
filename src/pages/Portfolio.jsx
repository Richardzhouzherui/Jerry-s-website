import GenerativeCanvas from "../components/GenerativeCanvas";
import { getAssetPath } from "../utils/paths";

export default function Portfolio() {
  return (
    <>
      <GenerativeCanvas />
      <div className="w-full h-screen flex flex-col justify-center items-center p-6 md:p-12">
        <div className="w-full max-w-[1200px] flex justify-between items-end mb-4 font-mono text-xs text-[#111]">
          <span>SECTOR_04: DESIGN_WORKS</span>
          <span>[PDF_VIEWER]</span>
        </div>

        <div className="w-full max-w-[1200px] h-[85vh] border border-black bg-white relative">
          {/* Corner Markers */}
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-black"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-black"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-black"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-black"></div>

          <iframe
            src={getAssetPath("/design-portfolio.pdf#toolbar=0")}
            title="Design Portfolio PDF"
            className="w-full h-full"
            style={{
              border: "none",
            }}
          />
        </div>
      </div>
    </>
  );
}