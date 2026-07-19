function doGet(e) {

  if (!e || !e.parameter || !e.parameter.placa) {
    return ContentService
      .createTextOutput(JSON.stringify({
        error: "Debe enviar el parámetro placa"
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var placa = e.parameter.placa.toUpperCase().trim();

  // Obtener la hoja activa
  var hoja = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("datos");

  if (!hoja) {
    return ContentService
      .createTextOutput(JSON.stringify({
        error: "No existe la hoja 'datos'"
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var datos = hoja.getDataRange().getValues();

  for (var i = 1; i < datos.length; i++) {

    if (String(datos[i][0]).toUpperCase().trim() === placa) {

      return ContentService
        .createTextOutput(JSON.stringify({
          encontrado: true,
          placa: datos[i][0],
          estado: datos[i][1]
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({
      encontrado: false
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

}