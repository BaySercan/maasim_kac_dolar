
document.addEventListener("DOMContentLoaded", function(event) {
    let formData = { baslangicYil: "1982", baslangicAy: "1", bitisYil: "2021", bitisAy: "11", malSepeti: "100" };

    // input listeners...

    // $("#baslangicYil").change(e => (formData.baslangicYil = e.target.value));
    // $("#bitisYil").change(e => (formData.bitisYil = e.target.value));
    // $("#baslangicAy").change(e => (formData.baslangicAy = e.target.value));
    // $("#bitisAy").change(e => (formData.bitisAy = e.target.value));
    // $("#malSepeti").change(e => (formData.malSepeti = e.target.value));

    //Diğer grafiğin başladığı aydan itibaren, her ay için tek tek maaş değerine göre dönüş alınacak.
    //Maaş gelen değere bölünecek ve sonuç o ay için grafik değeri olarak kaydedilecek

    hesapla(formData);
})

hesapla = (formData) => {
    $.ajax({
        type: "POST",
        url: "https://www4.tcmb.gov.tr/KIMENFHWS/enflasyon/hesapla",
        data: JSON.stringify(formData),
        contentType: "application/json",
        dataType: "json",
        success: response => {
            console.log(response);
        //   $("#toplamYil").text(response.toplamYil);
        //   $("#toplamDegisim").text(response.toplamDegisim);
        //   $("#ilkYilTufe").text(response.ilkYilTufe);
        //   $("#sonYilTufe").text(response.sonYilTufe);
        //   $("#toplamAy").text(response.toplamAy || "");
        //   $("#yeniSepetDeger").text(response.yeniSepetDeger || "");
        }, error: response => {
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