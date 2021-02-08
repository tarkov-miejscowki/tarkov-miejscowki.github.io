document.getElementById('tools-switch').addEventListener('click', e => {
    document.getElementById('tools').hidden = !document.getElementById('tools').hidden;
});

document.getElementById('change-map').addEventListener('click', e => {
    if (document.getElementById('maps').style.display == 'none') {
        document.getElementById('maps').style = '';
    } else {
        document.getElementById('maps').style.display = 'none';
    }
});
