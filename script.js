function doGet() {
  return HtmlService.createHtmlOutputFromFile("index")
    .setTitle("Consulta de Vehículos");
}

function buscarPlaca(placa) {

  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("datos");
  const datos = hoja.getDataRange().getValues();

  placa = placa.toUpperCase().trim();

  for (let i = 1; i < datos.length; i++) {

    if (datos[i][0].toString().toUpperCase() == placa) {

      return {
        placa: datos[i][0],
           estado: datos[i][1]
      };

    }

  }

  return null;

}