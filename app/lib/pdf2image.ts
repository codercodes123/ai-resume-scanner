// src/lib/pdf2image.ts
export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

let pdfjsLib: any = null;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
    loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) =>{
        // Use full URL to avoid 404 in Vite
        lib.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.mjs`;
        pdfjsLib = lib;
        return lib;
    }).catch(err => {
        console.error("Failed to load pdfjs-dist:", err);
        throw err;
    });

    return loadPromise;
}

export async function convertPdfToImage(file: File): Promise<PdfConversionResult> {
    try {
        const lib = await loadPdfJs();
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2.0 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
            return { imageUrl: "", file: null, error: "Canvas 2D context not available" };
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
            canvasContext: context,
            viewport
        }).promise;

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    const originalName = file.name.replace(/\.pdf$/i, "");
                    const imageFile = new File([blob], `${originalName}.png`, { type: "image/png" });
                    resolve({
                        imageUrl: URL.createObjectURL(blob),
                        file: imageFile,
                    });
                } else {
                    resolve({ imageUrl: "", file: null, error: "Failed to create image blob" });
                }
            }, "image/png", 1.0);
        });
    } catch (err: any) {
        // BETTER LOGGING: Include version info if mismatch
        const errorMsg = err.message || err;
        if (errorMsg.includes("API version") && errorMsg.includes("does not match the Worker version")) {
            console.error("🚨 PDF.js VERSION MISMATCH! Reinstall pdfjs-dist and recopy worker from node_modules.");
        }
        console.error("PDF to Image Error:", err);
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${errorMsg}`
        };
    }
}