document.addEventListener("DOMContentLoaded", function(event) {

    var maasInput = document.getElementById("maasGirInput");
    var btnHesapla = document.getElementById("btnHesapla");
    var maasGirisDiv = document.getElementById("maasyaz");
    var dolarBazindaAnlikMaasP = document.getElementById("dolarBazindaAnlikMaas");
    var grafikDiv = document.getElementById("grafikgoster");
    var dolarBazindaAnlikMaas;
    var tarih = new Date(Date.now());
    
    
    const ctx = document.getElementById('myChart').getContext('2d');
    
    var toDate = doToDate(tarih); 
    var fromDate = doFromDate(toDate);

    var siraliTarihler = MonthLastDaysDates(tarih);
    siraliTarihler.push(toDate);
    //console.log(siraliTarihler);

    btnHesapla.addEventListener("click", function () {
        var maas = parseInt(maasInput.value,10);
        var anlikKur = 0;
        var aylikData = [];
        var aylikMaas = [];
        var dbam = 0;

        (async () => {
            anlikKur = await anlik();
            dolarBazindaAnlikMaas = maas / anlikKur;
            dbam = dolarBazindaAnlikMaas.toFixed(2); 
            maasGirisDiv.style.display = "none";
            dolarBazindaAnlikMaasP.innerText = "$" + dbam.toString();
            grafikDiv.style.display = "block";

        })();

        (async () => {
            donenSonuc = await getir(fromDate, toDate);
            //console.log(donenSonuc.data)
           
            for(i=0; i<11; i++ ) {
               aylikData.push(donenSonuc.data[siraliTarihler[i]]["TRY"]);

                dolarMaas = maas / donenSonuc.data[siraliTarihler[i]]["TRY"];

                aylikMaas.push(dolarMaas.toFixed(2));
            }
            aylikMaas.push(dbam);
            aylikData.push(anlikKur);
           
            var aylar = ayIsimleri(tarih);
            
            const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: [{
                        label: 'Dolar Kuru',
                        data: aylikData,
                        // this dataset is drawn below
                        order: 2,
                        color:'#36a2eb',
                        backgroundColor: "#e755ba",
                        borderColor: "#b42d69",
                        yAxisID:'yKur',
                    }, {
                        label: 'Dolar bazında maas',
                        data: aylikMaas,
                        type: 'line',
                        order: 1,
                        color:'#36a2eb',
                        backgroundColor: "#178c59",
                        borderColor: "#22d386",
                        yAxisID:'yMaas',
                    
                    }],
                    labels: aylar
                },
                options: {
                    scales: {
                        yKur: {
                            beginAtZero: true,
                            position:'left'
                        },
                        yMaas: {
                            beginAtZero: true,
                            position:'right'
                        }
                    },
                    maintainAspectRatio: true,
                    aspectRatio:2,
                }
            });
    
        })()

    });

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

async function getir(fromDate, toDate) {
    var sonuc;
    await fetch('https://freecurrencyapi.net/api/v2/historical?' + new URLSearchParams({
        apikey: getKey(),    
        date_from: fromDate,
        date_to: toDate,
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

function baslamaTarihiHesapla(suanDate) {
    var bT = new Date(suanDate);
    bT.setMonth(bT.getMonth() - 11);
    return bT;

}

function doToDate(tarih) {
    var gun = tarih.getDate();
    var ay = tarih.getMonth() + 1;
    if (ay < 10) {
        ay.toString();
        ay = "0" + ay;
    }

    if (gun < 10) {
        gun.toString();
        gun = "0" + gun;
    }
    var yil = tarih.getFullYear();
    var toDate = yil.toString() + "-" + ay + "-" + gun.toString();
    return toDate;
}

function doFromDate(tarih) {
    var bt = baslamaTarihiHesapla(tarih);
    var gun = bt.getDate();
    var btAy = bt.getMonth() + 1;
    if (btAy < 10) {
        btAy.toString();
        btAy = "0" + btAy;
    }

    if (gun < 10) {
        gun.toString();
        gun = "0" + gun;
    }

    var fromDate = bt.getFullYear().toString() + "-" + btAy + "-" + gun.toString();
    return fromDate;
}

function MonthLastDaysDates(tarih) {
    siraliTarihler = [];
    
    for(i=0; i<11; i++) {
        var ilkTarih = new Date(baslamaTarihiHesapla(tarih));
        var tempDate = new Date(ilkTarih.setMonth(ilkTarih.getMonth() + i));
        var tempYear = tempDate.getFullYear();
        var tempMonth = tempDate.getMonth();

        var lastDay = lastday(tempYear, tempMonth);

        tempMonth = tempMonth + 1;
        if (tempMonth < 10) {
            tempMonth.toString();
            tempMonth = "0" + tempMonth;
        }

        var stringDate = tempYear + "-" + tempMonth + "-" + lastDay;

        siraliTarihler.push(stringDate);

    }

    return siraliTarihler;
}

function lastday(tempYear,tempMonth){
    var dt = new Date(tempYear, tempMonth + 1, 0);
    return  dt.getDate().toString();
}

function ayIsimleri(tarih) {
    const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
        "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];

    stringAylar = [];

    for(i=0; i<12; i++) { 
        var ilkTarih = new Date(baslamaTarihiHesapla(tarih));
        var tempDate = new Date(ilkTarih.setMonth(ilkTarih.getMonth() + i));
        var tempMonth = tempDate.getMonth();

        stringAylar.push(monthNames[tempMonth]);

    }
    return stringAylar;
}