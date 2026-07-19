function doGet(e) {

  var placa = (e.parameter.placa || "").toUpperCase().trim();

  var hoja = SpreadsheetApp.openById("1qnJa--oirZYqcb55X2AZAgD1V9EablSpCN7uKrRSj0s")
      .getSheetByName("datos");

  var datos = hoja.getDataRange().getValues();

  for (var i = 1; i < datos.length; i++) {

    if (datos[i][0].toString().toUpperCase() == placa) {

      return ContentService
        .createTextOutput(JSON.stringify({
          encontrado:true,
          placa:datos[i][0],
          estado:datos[i][1]
        }))
        .setMimeType(ContentService.MimeType.JSON);

    }

  }

  return ContentService
    .createTextOutput(JSON.stringify({
      encontrado:false
    }))
    .setMimeType(ContentService.MimeType.JSON);

}