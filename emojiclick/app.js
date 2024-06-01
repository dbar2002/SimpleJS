const closedface = document.querySelector('.closed')
const openface = document.querySelector('.open')

//Add event listener
closedface.addEventListener('click', () => {
    if(openface.classList.contains('open')) {
        openface.classList.add('active');
        closedface.classList.remove('active');

    }
});

//Add event listener
openface.addEventListener('click', () => {
    if(closedface.classList.contains('closed')) {
        closedface.classList.add('active');
        openface.classList.remove('active');
    }
});

   