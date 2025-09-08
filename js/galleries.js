// Galleries (images + Nacho videos)
$(document).ready(function() {
    $('.gallery-before').magnificPopup({
        type: 'image',
        gallery: { enabled: true },
        image: {titleSrc: 'title'},
        removalDelay: 300,
        mainClass: 'mfp-fade'
    });

    $('.gallery-2017').magnificPopup({
        type: 'image',
        gallery: { enabled: true },
        image: {titleSrc: 'title'},
        removalDelay: 300,
        mainClass: 'mfp-fade'
    });

    $('.gallery-2018').magnificPopup({
        type: 'image',
        gallery: { enabled: true },
        image: {titleSrc: 'title'},
        removalDelay: 300,
        mainClass: 'mfp-fade'
    });

    $('.gallery-2019').magnificPopup({
        type: 'image',
        gallery: { enabled: true },
        image: {titleSrc: 'title'},
        removalDelay: 300,
        mainClass: 'mfp-fade'
    });

    $('.gallery-2020').magnificPopup({
        type: 'image',
        gallery: { enabled: true },
        image: {titleSrc: 'title'},
        removalDelay: 300,
        mainClass: 'mfp-fade'
    });

    $('.gallery-2021').magnificPopup({
        type: 'image',
        gallery: { enabled: true },
        image: {titleSrc: 'title'},
        removalDelay: 300,
        mainClass: 'mfp-fade'
    });

    $('.gallery-2022').magnificPopup({
        type: 'image',
        gallery: { enabled: true },
        image: {titleSrc: 'title'},
        removalDelay: 300,
        mainClass: 'mfp-fade'
    });

    $('.gallery-2023').magnificPopup({
        type: 'image',
        gallery: { enabled: true },
        image: {titleSrc: 'title'},
        removalDelay: 300,
        mainClass: 'mfp-fade'
    });

    $('.gallery-2024').magnificPopup({
        type: 'image',
        gallery: { enabled: true },
        image: {titleSrc: 'title'},
        removalDelay: 300,
        mainClass: 'mfp-fade'
    });

    $('.gallery-2025').magnificPopup({
        type: 'image',
        gallery: { enabled: true },
        image: {titleSrc: 'title'},
        removalDelay: 300,
        mainClass: 'mfp-fade'
    });

    $('.gallery-2026').magnificPopup({
        type: 'image',
        gallery: { enabled: true },
        image: {titleSrc: 'title'},
        removalDelay: 300,
        mainClass: 'mfp-fade'
    });

    $('.gallery-Nacho').magnificPopup({
            gallery: { enabled: true },
            removalDelay: 300,
            mainClass: 'mfp-fade',
            image: { titleSrc: 'title' },
            callbacks: {
                elementParse: function(item) {
                    if (item.src.charAt(0) === '#') {
                        item.type = 'inline';
                    } else if (/\.(mp4|mov|webm)$/i.test(item.src)) {
                        item.type = 'iframe';
                    } else {
                        item.type = 'image';
                    }
                }
            }
        });
});