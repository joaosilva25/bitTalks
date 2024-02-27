let left_area=document.querySelector('.left_area');
let right_area=document.querySelector('.right_area');
let input_left=document.querySelector('.input_left');
let input_right=document.querySelector('.input_right');


    async function translated() {
        right_area.innerText = "..."
        const url = 'https://deep-translate1.p.rapidapi.com/language/translate/v2';
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': '70e331a89dmsh4d6d4f93cb8bde1p188907jsnd1bbb52152b1',
                'X-RapidAPI-Host': 'deep-translate1.p.rapidapi.com',
            },
            body:JSON.stringify ({
                q: `${left_area.value}`,
                source: `${input_left.value}`,
                target: `${input_right.value}`
            })
};

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            const translatedText2 = await result.data.translations.translatedText;
            right_area.innerText=`${translatedText2}`;
        } catch (error) {
            console.error(error);
        }
    }

left_area.addEventListener('input',translated)
input_left.addEventListener('change',translated)
input_right.addEventListener('change',translated)
