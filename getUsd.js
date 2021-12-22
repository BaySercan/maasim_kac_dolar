document.addEventListener("DOMContentLoaded", function(event) {

    //import {getKey} from 'apikey';
    var maasInput = document.getElementById("maasGirInput");
    var btnHesapla = document.getElementById("btnHesapla");
    var maasGirisDiv = document.getElementById("maasyaz");
    var dolarBazindaAnlikMaasP = document.getElementById("dolarBazindaAnlikMaas");
    var grafikDiv = document.getElementById("grafikgoster");
    var dolarBazindaAnlikMaas;

    (async () => {
        donenSonuc = await getir();
        console.log(donenSonuc);
    })()

    btnHesapla.addEventListener("click", function () {
        var maas = parseInt(maasInput.value,10);

        if(maas && maas > 0) {
            console.log("OK");
        } else {
            console.log("NOT OK!")
        }

        
        console.log(maas);


        (async () => {
            anlikKur = await anlik();
            console.log(anlikKur);
            dolarBazindaAnlikMaas = maas / anlikKur;
            dbam = dolarBazindaAnlikMaas.toFixed(2); 
            maasGirisDiv.style.display = "none";
            dolarBazindaAnlikMaasP.innerText = dbam;
            grafikDiv.style.display = "block";

        })()

        
    });

   
    
    
    

    //["2021-01-01"]["TRY"]
    // fetch('https://freecurrencyapi.net/api/v2/latest?' + new URLSearchParams({
    //     apikey: getKey(),    
    //     
    // }))
    // .then(response => response.json())
    // .then(result => console.log(result.data["TRY"]));
    
});



function validateNumber(event) {
    var key = window.event ? event.keyCode : event.which;
    if (event.keyCode === 8 || event.keyCode === 46) {
        return true;
    } else if ( key < 48 || key > 57 ) {
        return false;
    } else {
        return true;
    }
};

async function getir() {
    var sonuc;
    await fetch('https://freecurrencyapi.net/api/v2/historical?' + new URLSearchParams({
        apikey: getKey(),    
        date_from: '2021-01-01',
        date_to: '2021-12-31',
    }))
    .then(response => response.json())
    .then(result => sonuc = result);

    return sonuc;
}

async function anlik() {
    var sonuc;
    await fetch('https://freecurrencyapi.net/api/v2/latest?' + new URLSearchParams({
        apikey: getKey(),    
        
    }))
    .then(response => response.json())
    .then(result => sonuc = result.data["TRY"]);

    return sonuc;
}