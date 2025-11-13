import { GoogleGenAI, Modality } from "@google/genai";
import { dataUrlToParts } from '../utils/fileUtils';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API_KEY is not set. Please provide a valid API key in your environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const stylePrompts: { [key: string]: string } = {
  'Minimalist': `
**Deskripsi:** Gaya dengan fokus pada kesederhanaan, proporsi seimbang, dan eliminasi elemen tidak penting.
**Ciri Visual:**
- Layout rapi dengan ruang kosong luas.
- Komposisi simetris atau grid sederhana.
- Tipografi sans-serif modern, huruf tipis atau sedang.
- Tidak banyak dekorasi, elemen grafis hanya sebagai pendukung struktur.
- Biasanya memiliki kontras halus antar elemen untuk menonjolkan hierarki.
  `,
  'Studio Mode': `
**Deskripsi:** Gaya yang meniru pemotretan produk profesional di dalam studio. Fokusnya adalah pada produk itu sendiri, dengan pencahayaan dramatis dan latar belakang yang bersih.
**Ciri Visual:**
- Latar belakang sederhana, seringkali mulus (seamless) atau dengan gradien halus (misalnya, abu-abu, putih, atau warna netral).
- Pencahayaan terkontrol dan dramatis (misalnya, soft light, rim light) untuk menonjolkan bentuk dan tekstur produk.
- Bayangan yang disengaja (soft shadows atau hard shadows) untuk menambah kedalaman.
- Komposisi yang berpusat pada produk, bisa juga dengan properti studio minimalis (seperti podium, balok geometris, atau kain).
- Tidak ada teks atau elemen grafis yang mengganggu. Fokus 100% pada visual produk.
  `,
  'Modern / Corporate': `
**Deskripsi:** Gaya profesional yang menonjolkan kejelasan informasi dan struktur visual teratur.
**Ciri Visual:**
- Layout berbasis grid modular.
- Penggunaan tipografi sans-serif kuat dan mudah dibaca.
- Elemen visual sering berbentuk garis lurus, ikon sederhana, dan proporsi seimbang.
- Visual bersih, mengutamakan keseimbangan antara teks dan gambar.
- Menggunakan hierarki teks (judul, subjudul, isi) dengan jelas.
  `,
  'Flat Design': `
**Deskripsi:** Gaya visual dua dimensi tanpa efek realistik yang mengedepankan kejelasan bentuk.
**Ciri Visual:**
- Bentuk geometris sederhana dengan outline minimal.
- Ikon dan ilustrasi vektor datar.
- Tipografi sans-serif tegas dengan bobot medium hingga bold.
- Layout responsif dan mudah diadaptasi untuk tampilan digital.
- Fokus pada kejelasan ikonografi dan bentuk simbolik.
  `,
  'Gradient / Neo-Modern': `
**Deskripsi:** Gaya yang menonjolkan kedalaman visual dan dinamika komposisi melalui transisi lembut antar elemen.
**Ciri Visual:**
- Layering dan transparansi elemen untuk kedalaman.
- Tipografi futuristik atau geometric sans-serif.
- Komposisi sering menggunakan bentuk fluida atau abstrak.
- Elemen latar belakang memiliki pergerakan visual halus.
- Memiliki kesan digital dan modern dengan fokus visual pada pusat layout.
  `,
  'Retro / Vintage': `
**Deskripsi:** Gaya yang meniru tampilan estetika dari era masa lalu dengan detail klasik.
**Ciri Visual:**
- Tipografi dekoratif atau serif dengan karakter khas era tertentu.
- Tekstur lembut atau efek keusangan halus pada permukaan visual.
- Bentuk ornamen atau border sederhana untuk framing.
- Komposisi cenderung berpusat (centered layout).
- Sering memanfaatkan ilustrasi manual atau bentuk klasik.
  `,
  'Bold / Typographic': `
**Deskripsi:** Gaya dengan fokus utama pada kekuatan teks dan tipografi sebagai elemen visual dominan.
**Ciri Visual:**
- Ukuran huruf besar dengan bobot berat (bold atau extra bold).
- Penataan teks dinamis, sering menggunakan tumpang tindih antar huruf.
- Font sans-serif kuat atau display font modern.
- Layout asimetris untuk kesan ekspresif.
- Sedikit atau tanpa elemen pendukung grafis.
  `,
  'Geometric / Abstract': `
**Deskripsi:** Gaya yang berbasis pada bentuk matematis dan keseimbangan pola.
**Ciri Visual:**
- Dominasi bentuk geometris seperti lingkaran, segitiga, persegi, atau garis diagonal.
- Tipografi sans-serif atau modular.
- Struktur visual menggunakan pola berulang atau grid proporsional.
- Memiliki irama visual melalui keseimbangan bentuk.
- Minim tekstur, menonjolkan bentuk murni dan ritme komposisi.
  `,
  'Organic / Natural': `
**Deskripsi:** Gaya yang mengadopsi bentuk alami dan ritme organik, terasa lembut dan harmonis.
**Ciri Visual:**
- Bentuk melengkung dan tidak beraturan secara matematis.
- Tipografi humanist sans-serif atau serif lembut.
- Elemen layout cenderung asimetris dengan ruang mengalir.
- Tekstur halus menyerupai bahan alami.
- Proporsi elemen seimbang untuk efek visual menenangkan.
  `,
  'Futuristic / Tech': `
**Deskripsi:** Gaya dengan nuansa teknologi digital dan sistem visual berbasis sains atau mesin.
**Ciri Visual:**
- Tipografi techno atau condensed sans-serif.
- Penggunaan grid, garis, atau pola berulang menyerupai sirkuit.
- Komposisi presisi dengan efek cahaya atau highlight lembut.
- Elemen grafis berbentuk modular dan berorientasi diagonal.
- Layout menampilkan kedalaman perspektif dan struktur digital.
  `,
  'Grunge / Urban': `
**Deskripsi:** Gaya yang menampilkan kekasaran visual dan ekspresi tekstural yang mentah.
**Ciri Visual:**
- Tekstur kasar, noise, atau efek “rusak”.
- Tipografi distressed, stencil, atau handwriting bergaya bebas.
- Komposisi tidak simetris dan sering tampak acak.
- Elemen visual terasa tidak sempurna namun ekspresif.
- Nuansa visual kuat dengan kontras tinggi antar elemen.
  `,
  'Playful / Colorful': `
**Deskripsi:** Gaya ceria dan energik dengan bentuk dinamis serta tipografi ramah.
**Ciri Visual:**
- Bentuk tidak beraturan, elemen berinteraksi secara bebas.
- Tipografi bulat atau geometric rounded sans-serif.
- Layout dinamis, sering menampilkan elemen yang seolah bergerak.
- Ilustrasi vektor atau doodle sederhana.
- Mengedepankan ritme visual yang ringan dan ekspresif.
  `,
  'Luxury / Elegant': `
**Deskripsi:** Gaya yang menonjolkan kemewahan dan keanggunan melalui proporsi, tipografi, dan komposisi visual halus.
**Ciri Visual:**
- Tipografi serif klasik atau sans-serif berjarak lebar.
- Layout seimbang dengan margin luas dan ruang napas besar.
- Garis tipis digunakan sebagai elemen pemisah atau bingkai.
- Fokus pada keselarasan bentuk dan jarak antar elemen.
- Visual terkontrol dan berorientasi pada detail presisi.
  `,
  'Artistic / Illustrative': `
**Deskripsi:** Gaya yang mengutamakan ilustrasi atau karya manual sebagai pusat desain.
**Ciri Visual:**
- Elemen visual berbentuk lukisan, sketsa, atau goresan tangan.
- Tipografi berpadu dengan gaya ilustrasi (hand-lettering atau display font).
- Komposisi dinamis mengikuti bentuk ilustratif.
- Tekstur menyerupai medium tradisional seperti kuas atau pensil.
- Penekanan pada ekspresi dan keunikan gaya individual.
  `,
  'Editorial / Layout Focused': `
**Deskripsi:** Gaya yang menitikberatkan keseimbangan antara tipografi dan tata letak teks.
**Ciri Visual:**
- Struktur berbasis grid editorial.
- Tipografi serif atau sans-serif modern untuk readability tinggi.
- Elemen dekoratif minimal, fokus pada tata letak teks.
- Hierarki tipografi yang jelas (judul, subjudul, paragraf).
- Komposisi berimbang antara ruang kosong dan isi.
  `,
  'Experimental / Abstract Expression': `
**Deskripsi:** Gaya bebas dengan pendekatan eksperimental terhadap bentuk, teks, dan struktur.
**Ciri Visual:**
- Elemen visual tidak beraturan dan melanggar kaidah konvensional.
- Tipografi eksperimental, kadang terdistorsi atau tidak sejajar.
- Layout non-linear dengan fokus pada ekspresi dan gerak.
- Bentuk campuran antara digital, manual, dan deformasi visual.
- Tujuan utamanya adalah menciptakan efek emosional atau konseptual.
  `
};


/**
 * Generates a marketing description based on a product image.
 * @param base64Image The base64 encoded product image.
 * @param mimeType The MIME type of the image.
 * @returns A promise that resolves to a structured string of marketing copy.
 */
export async function generateMagicDescription(base64Image: string, mimeType: string): Promise<string> {
    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType,
        },
    };

    const textPart = {
        text: `
**PERAN & TUJUAN:** Anda adalah seorang copywriter pemasaran ahli. Tugas Anda adalah menganalisis gambar produk yang diberikan dan menulis teks pemasaran yang menarik dan terstruktur untuk poster dalam Bahasa Indonesia.

**PROSES:**
1.  **Identifikasi Produk:** Analisis gambar untuk memahami produknya, fitur utamanya, dan target audiensnya.
2.  **Buat Teks:** Berdasarkan analisis Anda, buat teks yang menarik yang menonjolkan manfaat produk.
3.  **Format Output:** Susun teks PERSIS seperti berikut, gunakan baris baru untuk memisahkan setiap bagian. Jangan menambahkan teks, penjelasan, atau format markdown lain (seperti **).

**FORMAT OUTPUT WAJIB (dalam Bahasa Indonesia):**
[HEADLINE YANG MENARIK]
[Deskripsi singkat produk yang memikat dalam satu atau dua kalimat.]
[AJAKAN BERTINDAK YANG JELAS]
`
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [imagePart, textPart],
            },
        });

        const text = response.text;
        if (text) {
            return text.trim();
        }

        throw new Error("Model returned an empty description.");

    } catch (error) {
        console.error("Error generating magic description with Gemini API:", error);
        throw new Error("Failed to communicate with the AI model for description generation.");
    }
}


/**
 * Removes the background from a given image, making it transparent.
 * @param base64Image The base64 encoded image.
 * @param mimeType The MIME type of the image.
 * @returns A promise that resolves to the base64 data URL of the image with a transparent background.
 */
export async function removeImageBackground(base64Image: string, mimeType: string): Promise<string> {
    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType,
        },
    };

    const textPart = {
        text: `
**TASK:** You are an expert photo editor. Your task is to accurately isolate the main subject(s) in the provided image and completely remove the background.

**CRITICAL INSTRUCTIONS:**
1.  **Identify Subject:** Clearly identify the primary product or subject.
2.  **Remove Background:** Erase the entire background, leaving only the main subject.
3.  **Transparent Background:** The new background MUST be fully transparent.
4.  **Preserve Details:** Maintain all details of the subject, including fine edges, shadows on the subject, and textures. Do not crop or alter the subject itself.

**FINAL OUTPUT REQUIREMENT:**
-   Generate ONLY ONE image.
-   The image must contain only the original subject on a transparent background.
-   The output MIME type should be 'image/png' to support transparency.
`
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [imagePart, textPart],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const firstPart = response.candidates?.[0]?.content?.parts?.[0];
    if (firstPart && firstPart.inlineData) {
        const base64Bytes = firstPart.inlineData.data;
        const imageMimeType = firstPart.inlineData.mimeType;
        return `data:${imageMimeType};base64,${base64Bytes}`;
    }
    
    throw new Error(`Model failed to remove image background.`);
}


/**
 * Generates a single product poster. This function is called in parallel by generatePosters.
 * @param images The base64 encoded product images with their MIME types.
 * @param description The text to include in the poster. Can be empty.
 * @param style The desired design style.
 * @param conceptInfo A string to differentiate this request, e.g., "Concept 1 of 4".
 * @param aspectRatio The desired aspect ratio for the poster (e.g., '1:1', '9:16').
 * @returns A promise that resolves to the base64 image data URL.
 */
async function generateSinglePoster(images: { base64: string, mimeType: string }[], description: string, style: string, conceptInfo: string, aspectRatio: string): Promise<string> {
    const imageParts = images.map(image => ({
        inlineData: { data: image.base64, mimeType: image.mimeType }
    }));

    const styleDescription = stylePrompts[style] || `Gaya "${style}" yang menarik secara visual.`;

    const productInstruction = images.length > 1
        ? 'Seamlessly integrate ALL of the provided product images into the generated scene. The products are the heroes. Create a natural and visually appealing composition with all items.'
        : 'Seamlessly integrate the provided product image into the generated scene. The product is the hero.';
    
    const textInstruction = description.trim()
        ? `Artistically place the text "${description}" into the composition. Font choice must match the "${style}". All text must be readable and well-composed.`
        : 'DO NOT ADD ANY TEXT to the poster. The poster must be purely visual. Focus on creating a stunning, text-free image.';


    const textPart = {
        text: `
**TASK: GENERATE A PRODUCT POSTER IMAGE**

**PRIMARY CONSTRAINT: ASPECT RATIO**
-   The output image's aspect ratio MUST be exactly **${aspectRatio}**.
-   This is the single most important instruction. Do not deviate.
-   If the aspect ratio is not **${aspectRatio}**, the entire task is a failure.

**INPUTS:**
1.  **Product Image(s):** One or more images of a product with a transparent background.
2.  **Poster Text:** "${description}"
3.  **Design Style:** "${style}"
4.  **Concept Info:** "${conceptInfo}" (Ensure this version is unique).

**INSTRUCTIONS:**
1.  **Generate Scene:** Create a new, photorealistic scene relevant to the product. Do not use a plain color background.
    -   *Example for skincare:* Add water splashes, botanical ingredients, clean lab setting.
    -   *Example for coffee:* Add coffee beans, steam, rustic table.
2.  **Place Product:** ${productInstruction}
3.  **Apply Style ("${style}"):** The design style must dictate the entire aesthetic: color palette, lighting, mood, and typography. Use the following detailed characteristics for the "${style}" style:
${styleDescription}
4.  **Integrate Text:** ${textInstruction}

**FINAL OUTPUT CHECKLIST:**
-   [ ] Is the aspect ratio EXACTLY **${aspectRatio}**? (MANDATORY)
-   [ ] Is the image a single, complete, professional poster?
-   [ ] Is the design unique for this concept?

Generate ONE image that meets all these criteria.
`
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [...imageParts, textPart],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const firstPart = response.candidates?.[0]?.content?.parts?.[0];
    if (firstPart && firstPart.inlineData) {
        const base64Bytes = firstPart.inlineData.data;
        const imageMimeType = firstPart.inlineData.mimeType;
        return `data:${imageMimeType};base64,${base64Bytes}`;
    }
    
    throw new Error(`Model failed to generate image for concept: ${conceptInfo}`);
}


/**
 * Generates product posters by making parallel requests to the Gemini API.
 * @param images The product images to use for generation.
 * @param description The text to include in the poster.
 * @param style The desired design style.
 * @param numImages The number of images to generate.
 * @param aspectRatio The desired aspect ratio for the posters.
 * @returns A promise that resolves to an array of base64 image data URLs.
 */
export async function generatePosters(images: { base64: string, mimeType: string }[], description: string, style: string, numImages: number, aspectRatio: string): Promise<string[]> {
    try {
        const processedDataUrls = await Promise.all(
            images.map(img => removeImageBackground(img.base64, img.mimeType))
        );
        const imagesForGeneration = processedDataUrls.map(dataUrl => dataUrlToParts(dataUrl));
        
        const generationPromises: Promise<string>[] = [];

        for (let i = 0; i < numImages; i++) {
            const conceptInfo = `Concept ${i + 1} of ${numImages}. This concept must be visually distinct from the others.`;
            generationPromises.push(
                generateSinglePoster(imagesForGeneration, description, style, conceptInfo, aspectRatio)
            );
        }

        const generatedImages = await Promise.all(generationPromises);

        if (generatedImages.length !== numImages || generatedImages.some(img => !img)) {
             throw new Error("The model did not return the expected number of images.");
        }

        return generatedImages;

    } catch (error) {
        console.error("Error generating posters with Gemini API:", error);
        if (error instanceof Error && error.message.includes('Model failed')) {
            throw new Error("The AI failed to generate one or more posters. Please try again.");
        }
        throw new Error("Failed to communicate with the AI model. Check your connection and API key.");
    }
}

/**
 * Regenerates a single product poster based on an existing one, aiming for a new creative direction.
 * @param productImages The base64 encoded original product images.
 * @param base64ExistingPoster The base64 encoded poster to be regenerated.
 * @param description The text to include in the poster.
 * @param style The desired design style.
 * @param aspectRatio The desired aspect ratio for the new poster.
 * @returns A promise that resolves to the base64 image data URL of the new poster.
 */
export async function regeneratePoster(productImages: { base64: string, mimeType: string }[], base64ExistingPoster: string, description: string, style: string, aspectRatio: string): Promise<string> {
    
    const processedProductUrls = await Promise.all(
        productImages.map(img => removeImageBackground(img.base64, img.mimeType))
    );
    const productPartsForGeneration = processedProductUrls.map(dataUrl => {
        const { base64, mimeType } = dataUrlToParts(dataUrl);
        return { inlineData: { data: base64, mimeType: mimeType } };
    });

    const existingPosterPart = {
        inlineData: {
            data: base64ExistingPoster,
            mimeType: 'image/jpeg', // The poster is likely jpeg/png, exact type isn't critical for context
        },
    };

    const styleDescription = stylePrompts[style] || `Gaya "${style}" yang menarik secara visual.`;

    const productInstruction = productImages.length > 1
        ? 'Seamlessly integrate ALL of the provided product images into the new scene.'
        : 'Seamlessly integrate the provided product image into the new scene.';
        
    const textInstruction = description.trim()
        ? `Artistically place the text "${description}" into the composition. Font choice must match the "${style}".`
        : 'DO NOT ADD ANY TEXT to the poster. The poster must be purely visual.';

    const textPart = {
        text: `
**TASK: REGENERATE A PRODUCT POSTER WITH A NEW DESIGN**

**PRIMARY CONSTRAINT: ASPECT RATIO**
-   The output image's aspect ratio MUST be exactly **${aspectRatio}**.
-   This is the single most important instruction. Do not deviate.
-   If the aspect ratio is not **${aspectRatio}**, the entire task is a failure.

**INPUTS:**
1.  **Product Image(s):** The product image(s) to use for the poster.
2.  **Previous Poster:** An image of a poster you created before (use for reference of what to AVOID).
3.  **Poster Text:** "${description}"
4.  **Design Style:** "${style}"

**INSTRUCTIONS:**
1.  **BE RADICALLY DIFFERENT:** The new poster MUST be visually distinct from the previous poster provided. Generate a fresh, unique concept with a new layout, background scene, color palette, and typographic approach. Do NOT make minor tweaks.
2.  **Generate Scene:** Create a new, photorealistic scene relevant to the product.
3.  **Place Product:** ${productInstruction}
4.  **Apply Style ("${style}"):** The design style must dictate the entire aesthetic. Use the following detailed characteristics for the "${style}" style:
${styleDescription}
5.  **Integrate Text:** ${textInstruction}

**FINAL OUTPUT CHECKLIST:**
-   [ ] Is the aspect ratio EXACTLY **${aspectRatio}**? (MANDATORY)
-   [ ] Is the new design COMPLETELY different from the previous one?
-   [ ] Is the image a single, professional poster?

Generate ONE new image that meets all these criteria.
`
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [...productPartsForGeneration, existingPosterPart, textPart],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const firstPart = response.candidates?.[0]?.content?.parts?.[0];
        if (firstPart && firstPart.inlineData) {
            const base64Bytes = firstPart.inlineData.data;
            const imageMimeType = firstPart.inlineData.mimeType;
            return `data:${imageMimeType};base64,${base64Bytes}`;
        }
        
        throw new Error(`Model failed to regenerate image.`);
    } catch (error) {
        console.error("Error regenerating poster with Gemini API:", error);
        throw new Error("Failed to communicate with the AI model for regeneration.");
    }
}


// --- WEDDING SUITE ---

/**
 * Creates the dynamic prompt for wedding poster generation.
 */
const createWeddingPrompt = (
    description: string,
    conceptType: 'Prewedding' | 'Wedding',
    locationType: 'Indoor' | 'Outdoor',
    theme: string,
    aspectRatio: string,
    conceptInfo: string,
    isRegeneration: boolean = false
): string => {
    
    let sceneInstruction = '';
    if (conceptType === 'Wedding') {
        sceneInstruction = `The scene MUST depict an actual wedding event. Generate a beautiful, celebratory wedding ceremony or reception scene based on the "${theme}" and "${locationType}" location. Couple's attire MUST be formal wedding wear (e.g., tuxedo/suit, wedding gown).`;
    } else { // Prewedding
        sceneInstruction = `The scene is for a creative pre-wedding photoshoot. Based on the theme "${theme}" and location type "${locationType}", generate an appropriate, artistic, and photorealistic background. Crucially, change the couple's clothing to match the theme perfectly (e.g., stylish cowboy outfits for 'Western Cowboy' theme, not wedding clothes).`;
    }

    const regenerationDirective = isRegeneration 
        ? "**CRITICAL REGENERATION TASK:** The third image provided is a previous version. Your task is to create a **COMPLETELY NEW AND RADICALLY DIFFERENT** poster. Do NOT make minor tweaks. Generate a fresh concept with a new layout, background scene, color palette, and typographic approach."
        : "";

    return `
**TASK: CREATE A ROMANTIC COUPLE POSTER**

**PRIMARY CONSTRAINT: ASPECT RATIO**
-   The output image's aspect ratio MUST be exactly **${aspectRatio}**.
-   This is the single most important instruction. Do not deviate.

**NON-NEGOTIABLE CORE DIRECTIVE: PRESERVE FACES**
-   You MUST NOT alter the facial features, head structure, hair, or skin tone of the individuals from their original photos.
-   The likeness of both people MUST be perfectly preserved. Change their clothes and environment, NOT the people.
-   Any change to the face or head is a complete failure of the task.

**INPUTS:**
1.  **Man's Photo:** An image of a man.
2.  **Woman's Photo:** An image of a woman.
${isRegeneration ? "3.  **Previous Poster:** An image of a poster to AVOID copying." : ""}

${regenerationDirective}

**INSTRUCTIONS:**
1.  **Merge & Compose:** Seamlessly merge the man and woman into a single, new, photorealistic scene. Position them together naturally and romantically.
2.  **Generate Scene:**
    -   **Concept Type:** ${conceptType}
    -   **Location:** ${locationType}
    -   **Artistic Theme:** ${theme}
    -   **Execution:** ${sceneInstruction}
    -   Ensure lighting, shadows, and color grading on the couple match the new scene.
3.  **Integrate Text:**
    -   **Text Content:** "${description}"
    -   Artistically place the text into the composition. Font choice must match the "${theme}" mood. Text must be readable.

**FINAL OUTPUT CHECKLIST:**
-   [ ] Is the aspect ratio EXACTLY **${aspectRatio}**? (MANDATORY)
-   [ ] Are the faces and heads of both individuals IDENTICAL to the input photos? (MANDATORY)
-   [ ] Is the image a single, professional, and romantic poster?
-   [ ] Is the design unique for this concept (${conceptInfo})?

Generate ONE image that meets all these criteria.
`;
}

/**
 * Generates a single wedding poster from two separate images.
 */
async function generateSingleWeddingPoster(
    manImage: { base64: string, mimeType: string },
    womanImage: { base64: string, mimeType: string },
    description: string,
    conceptType: 'Prewedding' | 'Wedding',
    locationType: 'Indoor' | 'Outdoor',
    theme: string,
    conceptInfo: string,
    aspectRatio: string
): Promise<string> {
    const manImagePart = { inlineData: { data: manImage.base64, mimeType: manImage.mimeType } };
    const womanImagePart = { inlineData: { data: womanImage.base64, mimeType: womanImage.mimeType } };

    const prompt = createWeddingPrompt(description, conceptType, locationType, theme, aspectRatio, conceptInfo);
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [manImagePart, womanImagePart, textPart],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const firstPart = response.candidates?.[0]?.content?.parts?.[0];
    if (firstPart && firstPart.inlineData) {
        const base64Bytes = firstPart.inlineData.data;
        const imageMimeType = firstPart.inlineData.mimeType;
        return `data:${imageMimeType};base64,${base64Bytes}`;
    }
    
    throw new Error(`Model failed to generate image for concept: ${conceptInfo}`);
}


/**
 * Generates wedding posters by making parallel requests.
 */
export async function generateWeddingPosters(
    manImage: { base64: string, mimeType: string },
    womanImage: { base64: string, mimeType: string },
    description: string,
    conceptType: 'Prewedding' | 'Wedding',
    locationType: 'Indoor' | 'Outdoor',
    theme: string,
    numImages: number,
    aspectRatio: string
): Promise<string[]> {
    try {
        const generationPromises: Promise<string>[] = [];

        for (let i = 0; i < numImages; i++) {
            const conceptInfo = `Concept ${i + 1} of ${numImages}. This concept must be visually distinct from the others.`;
            generationPromises.push(
                generateSingleWeddingPoster(manImage, womanImage, description, conceptType, locationType, theme, conceptInfo, aspectRatio)
            );
        }

        const generatedImages = await Promise.all(generationPromises);

        if (generatedImages.length !== numImages || generatedImages.some(img => !img)) {
             throw new Error("The model did not return the expected number of images.");
        }

        return generatedImages;

    } catch (error) {
        console.error("Error generating wedding posters with Gemini API:", error);
        if (error instanceof Error && error.message.includes('Model failed')) {
            throw new Error("The AI failed to generate one or more posters. Please try again.");
        }
        throw new Error("Failed to communicate with the AI model. Check your connection and API key.");
    }
}

/**
 * Regenerates a single wedding poster.
 */
export async function regenerateWeddingPoster(
    manImage: { base64: string, mimeType: string },
    womanImage: { base64: string, mimeType: string },
    existingPosterBase64: string,
    description: string,
    conceptType: 'Prewedding' | 'Wedding',
    locationType: 'Indoor' | 'Outdoor',
    theme: string,
    aspectRatio: string
): Promise<string> {
    const manImagePart = { inlineData: { data: manImage.base64, mimeType: manImage.mimeType } };
    const womanImagePart = { inlineData: { data: womanImage.base64, mimeType: womanImage.mimeType } };
    const existingPosterPart = { inlineData: { data: existingPosterBase64, mimeType: 'image/jpeg' } };

    const prompt = createWeddingPrompt(description, conceptType, locationType, theme, aspectRatio, "Regeneration", true);
    const textPart = { text: prompt };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [manImagePart, womanImagePart, existingPosterPart, textPart],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const firstPart = response.candidates?.[0]?.content?.parts?.[0];
        if (firstPart && firstPart.inlineData) {
            const base64Bytes = firstPart.inlineData.data;
            const imageMimeType = firstPart.inlineData.mimeType;
            return `data:${imageMimeType};base64,${base64Bytes}`;
        }
        
        throw new Error(`Model failed to regenerate wedding image.`);
    } catch (error) {
        console.error("Error regenerating wedding poster with Gemini API:", error);
        throw new Error("Failed to communicate with the AI model for regeneration.");
    }
}
