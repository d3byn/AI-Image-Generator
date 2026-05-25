const API_KEY = 'a1530bedd0msh34898b2f1df6118p1420fajsnc13eae01c858';
const API_URL ='https://ai-text-to-image-generator-flux-free-api.p.rapidapi.com/aaaaaaaaaaaaaaaaaiimagegenerator/quick.php';

const imageContainer = document.getElementById('imageContainer');

const imageResultElement = document.getElementById('imageResult');

async function generateImage() {

    const promptValue = document.getElementById('prompt').value.trim();
    const styleValue = document.getElementById('dropdownStyles').value;
    const ratioValue = document.getElementById('dropdownRatio').value;

    if (!promptValue) {
        alert('Please enter a prompt');
        return;
    }
    setLoadingState(true);
    try {
        let styleId = 1;
        if (styleValue === 'anime') {
            styleId = 4;
        } else if (styleValue === 'realism') {
            styleId = 1;
        }

        let imageSize = '1-1';
        if (ratioValue === 'landscape_16_9') {
            imageSize = '16-9';
        } else if (ratioValue === 'portrait_9_16') {
            imageSize = '9-16';
        }

        const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'x-rapidapi-key': API_KEY,
                    'x-rapidapi-host': 'ai-text-to-image-generator-flux-free-api.p.rapidapi.com',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: promptValue,
                    style_id: styleId,
                    size: imageSize
                })
            });

        const data = await response.json();
        console.log('FULL API RESPONSE:', data);

        if (!response.ok) {
            throw new Error(
                data.message ||
                'Failed to generate image'
            );
        }
        const imageUrl =
            data?.final_result?.[0]?.origin ||
            data?.final_result?.[0]?.image ||
            data?.final_result?.[0]?.url ||
            data?.image ||
            data?.url;

        console.log('Image URL:', imageUrl);

        if (!imageUrl) {
            throw new Error(
                'No image URL returned from API'
            );
        }

        imageResultElement.src = imageUrl;
        imageResultElement.style.display = 'block';

        console.log('Image generated successfully!');

    } catch (error) {
        console.error(error);
        alert( error.message ||'Image generation failed');

    } finally {
        setLoadingState(false);
    }
}

function setLoadingState(isLoading) {
    if (isLoading) {
        imageContainer.classList.add('loading');
    } else {
        imageContainer.classList.remove('loading');
    }
}

function downloadImage() {
    const imageUrl =imageResultElement.src;
    if (!imageUrl) {
        alert('No image available');
        return;
    }

    const link = document.createElement('a');
    link.href =imageUrl;
    link.download ='ai-generated-image.jpg';
    document.body.appendChild(link);
    link.click();

}