const API_KEY = {YOUR API KEY};
const API_URL = 'https://api.vyro.ai/v2/image/generations';

const imageContainer = document.getElementById('imageContainer');
const imageResultElement = document.getElementById('imageResult');

function generateImage() {
    let promptValue;
    let styleValue;
    let ratioValue;

    try {
        promptValue = document.getElementById('prompt').value;
        styleValue = document.getElementById('dropdownStyles').value;
        ratioValue = document.getElementById('dropdownRatio').value;
        if (!promptValue) {
            throw new Error("Prompt is required");
        }
        console.log(promptValue);
        console.log(styleValue);
        console.log(ratioValue);
    } catch (err) {
        console.error(err);
        alert("Enter proper values for all fields");
        return;
    }

    setLoadingState(true);

    //Form data for API request
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + API_KEY);

    const formData = new FormData();
    formData.append("prompt", promptValue);
    formData.append("style", styleValue);
    formData.append("aspect_ratio", ratioValue);
    formData.append("seed", "5");

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formData,
        redirect: "follow"
    };

    fetch(API_URL, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const errorText = await response.text();
                console.log(errorText);
                throw new Error("Failed to generate image");
            }
            return response.blob();
        })
        .then((blob) => {
            const imageUrl = URL.createObjectURL(blob);
            imageResultElement.src = imageUrl;
            imageResultElement.style.display = 'block';
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("Image generation failed.");
        })
        .finally(() => {
            setLoadingState(false);
        });
}

function setLoadingState(isLoading) {
    if (isLoading) {
        imageResultElement.style.display = 'none';
        imageContainer.classList.add('loading');
    }
    else {
        imageResultElement.style.display = 'block';
        imageContainer.classList.remove('loading');
    }

}

function downloadImage() {
    const imageUrl = imageResultElement.src;

    if (!imageUrl) {
        alert("No image to download. Please generate an image first.");
        return;
    }

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'ai-generated_image.jpg';
    link.click();

}
