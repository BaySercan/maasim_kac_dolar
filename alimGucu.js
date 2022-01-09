document.addEventListener("DOMContentLoaded", function(event) {
    var maasInput = document.getElementById("maasGirInput");
    const currentDate = new Date(Date.now());
    const sonYil = currentDate.getFullYear() - 1;
    var alimGucuList = [];
    //var request = require('request');
    //let formData = { baslangicYil: "2020", baslangicAy: "1", bitisYil: sonYil.toString(), bitisAy: "12", malSepeti: "9300" };
    
    // input listeners...

    // $("#baslangicYil").change(e => (formData.baslangicYil = e.target.value));
    // $("#bitisYil").change(e => (formData.bitisYil = e.target.value));
    // $("#baslangicAy").change(e => (formData.baslangicAy = e.target.value));
    // $("#bitisAy").change(e => (formData.bitisAy = e.target.value));
    // $("#malSepeti").change(e => (formData.malSepeti = e.target.value));

    //Diğer grafiğin başladığı aydan itibaren, her ay için tek tek maaş değerine göre dönüş alınacak.
    //Maaş gelen değere bölünecek ve sonuç o ay için grafik değeri olarak kaydedilecek

    btnHesapla.addEventListener("click", function () { 
        var maas = parseInt(maasInput.value,10);
        
        if(currentDate.getMonth() == 0) {
            //Yılın ilk ayı ise, önceki yılın 12 ayının ayrı ayrı verisini al 
            const asyncLoop = async () => {
                for (let i = 0; i < 12; i++) {
                    var ilkAy = i + 1;
                    var sonrakiAy = ilkAy + 1;
                    let formData = { baslangicYil: sonYil.toString(), 
                                    baslangicAy: ilkAy.toString(), 
                                    bitisYil: sonYil.toString(), 
                                    bitisAy: sonrakiAy.toString(), 
                                    malSepeti: "9300" };
                    const data = await hesapla(formData, maas);
                }
            }
    
            asyncLoop().then(console.log(alimGucuList));
            
        } else {
            //Yılın ilk ayı değilse
            for(var i = 0; i<12; i++) {
                var ilkAy = i + 1;
                //var sonAy = ilkAy + 11;
                let formData = { baslangicYil: sonYil.toString(),
                                baslangicAy: ilkAy.toString(), 
                                bitisYil: sonYil.toString(), 
                                bitisAy: ilkAy.toString(), 
                                malSepeti: "9300" };
    
                hesapla(formData);
            }
        }
    });

})

async function hesapla(formData, maas) {
    await $.ajax({
        type: "POST",
        url: "https://www4.tcmb.gov.tr/KIMENFHWS/enflasyon/hesapla",
        data: JSON.stringify(formData),
        contentType: "application/json",
        dataType: "json",
        success: response => {
            console.log(formData.baslangicAy + " " + formData.bitisAy);
            console.log(response);
            var ag = ((maas / parseFloat(response.yeniSepetDeger.replace(',',''))) * 100).toFixed(2);
            console.log(ag)
        //   $("#toplamYil").text(response.toplamYil);
        //   $("#toplamDegisim").text(response.toplamDegisim);
        //   $("#ilkYilTufe").text(response.ilkYilTufe);
        //   $("#sonYilTufe").text(response.sonYilTufe);
        //   $("#toplamAy").text(response.toplamAy || "");
        //   $("#yeniSepetDeger").text(response.yeniSepetDeger || "");
        }, error: response => {
            console.log(formData.baslangicAy + " " + formData.bitisAy);
            console.log("hata");
            if (response.readyState === 4 && response.getResponseHeader("Content-Type").indexOf("application/json") >=0) {
                console.log(JSON.parse(response.responseText).mesaj);
                
                // $("#hataMesaj").text(JSON.parse(response.responseText).mesaj);
                
                // setTimeout(function() {
                //     $("#hataMesaj").text("");
                // },3000)
            }
        }
    });
};